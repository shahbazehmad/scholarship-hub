import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { normalizeLegacy } from './legacy-normalize.mjs';

const args = process.argv.slice(2);
if (args.some(a => a !== '--apply')) throw new Error('Only --apply is supported');
const raw = await readFile('data/scholarships.json', 'utf8');
const input = JSON.parse(raw);
if (!Array.isArray(input) || input.length === 0) throw new Error('Expected a non-empty JSON array');
const records = input.map(normalizeLegacy);
if (new Set(records.map(r => r.slug)).size !== records.length) throw new Error('Duplicate input slugs: resolve before migration; no records written');
const inputHash = createHash('sha256').update(raw).digest('hex');
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
console.log(JSON.stringify({ mode: args.includes('--apply') ? 'apply' : 'dry-run', commit, inputHash, inputCount: records.length, pendingReview: records.length, note: 'Unsupported legacy claims retained in legacy_record, not promoted to verified fields' }, null, 2));
if (!args.includes('--apply')) process.exit(0);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set as a private environment variable');
const { default: pg } = await import('pg');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 60000 });
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query("SELECT pg_advisory_xact_lock(hashtext('scholarship-hub-legacy-import'))");
  const run = await client.query('INSERT INTO migration_runs(repository_commit,input_hash,input_count) VALUES($1,$2,$3) RETURNING id', [commit,inputHash,records.length]);
  let inserted = 0;
  for (const r of records) {
    const result = await client.query(`INSERT INTO opportunities(legacy_slug,slug,title,institution_name,countries,country_codes,region,description,logo_url,image_urls,original_source_name,original_source_url,source_type,application_details,legacy_record,verification_status,review_status)
      VALUES($1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb,'needs_review','pending')
      ON CONFLICT(slug) DO NOTHING RETURNING id`, [r.slug,r.title,r.institution_name,r.countries,r.country_codes,r.region,r.description,r.logo_url,r.image_urls,r.original_source_name,r.original_source_url,r.source_type,JSON.stringify(r.application_details),JSON.stringify(r.legacy_record)]);
    if (result.rowCount) {
      inserted++;
      await client.query('INSERT INTO opportunity_revisions(opportunity_id,snapshot,actor,reason) SELECT id,to_jsonb(o),$2,$3 FROM opportunities o WHERE id=$1', [result.rows[0].id,'legacy-import','Original JSON migration; claims require verification']);
    }
  }
  const reconciliation = await client.query('SELECT slug,legacy_record FROM opportunities WHERE slug = ANY($1::text[])', [records.map(r => r.slug)]);
  if (reconciliation.rowCount !== records.length) throw new Error('Reconciliation failed');
  const bySlug = new Map(reconciliation.rows.map(r => [r.slug,r.legacy_record]));
  const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k,canonical(value[k])])) : value;
  for (const r of records) {
    if (JSON.stringify(canonical(bySlug.get(r.slug))) !== JSON.stringify(canonical(r.legacy_record))) throw new Error(`Existing snapshot differs for ${r.slug}; aborting without overwriting`);
  }
  await client.query('UPDATE migration_runs SET imported_count=$2,details=$3::jsonb,completed_at=now() WHERE id=$1', [run.rows[0].id,inserted,JSON.stringify({ skippedExisting: records.length-inserted, reconciled:reconciliation.rowCount })]);
  await client.query('COMMIT');
  console.log(JSON.stringify({ imported:inserted, skippedExisting:records.length-inserted, reconciled:reconciliation.rowCount }));
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('Import aborted. No records from this transaction were committed.');
  process.exitCode = 1;
} finally { await client.end(); }
