import 'server-only';
import { Pool, type PoolClient } from 'pg';

export type OpportunityStatus = 'Open' | 'Upcoming' | 'Closing Soon' | 'Closed' | 'Expired' | 'Unverified';
export interface PublicOpportunity {
  id: string; slug: string; title: string; institution_name: string | null;
  countries: string[]; country_codes: string[]; region: string | null; city: string | null;
  levels: string[]; fields: string[]; opportunity_type: string | null;
  description: string | null; funding_categories: string[];
  funding_details: Record<string, unknown>; eligibility: Record<string, unknown>;
  application_details: Record<string, unknown>;
  opening_at: string | null; deadline_at: string | null; published_at: string | null;
  updated_at: string; last_verified_at: string | null; verification_status: string;
  announcement_url: string | null; application_url: string | null;
  original_source_name: string | null; original_source_url: string | null;
  logo_url: string | null; featured: boolean; status: OpportunityStatus;
}
export interface OpportunityFilters {
  query?: string; level?: string; field?: string; country?: string; region?: string;
  institution?: string; funding?: string; type?: string; status?: OpportunityStatus;
  archive?: boolean; page?: number; pageSize?: number;
  sort?: 'updated' | 'published' | 'deadline' | 'title';
}
let pool: Pool | undefined;
function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_READ_URL;
  if (!connectionString) throw new Error('Public database reader is not configured');
  let url: URL;
  try { url = new URL(connectionString); } catch { throw new Error('Invalid reader configuration'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !['require','verify-ca','verify-full'].includes(url.searchParams.get('sslmode') ?? '')) throw new Error('Reader requires a TLS PostgreSQL connection');
  pool = new Pool({ connectionString, max: 3, idleTimeoutMillis: 10000, connectionTimeoutMillis: 15000, statement_timeout: 10000, application_name: 'scholarship-hub-public' });
  pool.on('error', () => console.error('Public database pool error'));
  return pool;
}
async function read<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  let client: PoolClient | undefined;
  try {
    client = await getPool().connect();
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const flags = await client.query<{ allowed: boolean }>(`SELECT NOT (r.rolsuper OR r.rolbypassrls OR r.rolcreaterole OR r.rolcreatedb OR r.oid = d.datdba) AS allowed FROM pg_roles r CROSS JOIN pg_database d WHERE r.rolname = session_user AND d.datname = current_database()`);
    if (flags.rows[0]?.allowed !== true) throw new Error('Privileged reader connection rejected');
    await client.query('SET LOCAL ROLE scholarship_public_reader');
    await client.query('SET LOCAL row_security = on');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch {
    if (client) await client.query('ROLLBACK').catch(() => {});
    throw new Error('Opportunity database read unavailable');
  } finally { client?.release(); }
}

const STATUS = `CASE
 WHEN archived_at IS NOT NULL OR confirmed_application_status = 'expired' THEN 'Expired'
 WHEN confirmed_application_status = 'closed' OR deadline_at < now() THEN 'Closed'
 WHEN opening_at > now() THEN 'Upcoming'
 WHEN deadline_at >= now() AND deadline_at <= now() + interval '14 days' THEN 'Closing Soon'
 WHEN confirmed_application_status = 'open' OR (opening_at <= now() AND deadline_at >= now()) THEN 'Open'
 WHEN confirmed_application_status = 'upcoming' THEN 'Upcoming'
 ELSE 'Unverified' END`;
const COLUMNS = `id,slug,title,institution_name,countries,country_codes,region,city,levels,fields,opportunity_type,description,funding_categories,funding_details,eligibility,application_details,opening_at::text,deadline_at::text,published_at::text,updated_at::text,last_verified_at::text,verification_status,announcement_url,application_url,original_source_name,original_source_url,logo_url,featured,${STATUS} AS status`;
const SEARCH = `to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(institution_name,'') || ' ' || coalesce(description,''))`;
const finite = (v: number | undefined, fallback: number, max: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(1, Math.min(max, Math.floor(v))) : fallback;
const text = (v: string | undefined) => typeof v === 'string' ? v.trim().slice(0, 200) : '';

export async function searchOpportunities(filters: OpportunityFilters = {}) {
  const page = finite(filters.page, 1, 10000);
  const pageSize = finite(filters.pageSize, 12, 48);
  const values: unknown[] = [];
  const bind = (v: unknown) => { values.push(v); return `$${values.length}`; };
  const clauses = ["review_status = 'approved'", 'duplicate_of IS NULL'];
  clauses.push(filters.archive ? `(archived_at IS NOT NULL OR deadline_at < now() OR confirmed_application_status IN ('closed','expired'))` : `(archived_at IS NULL AND (deadline_at IS NULL OR deadline_at >= now()) AND (confirmed_application_status IS NULL OR confirmed_application_status NOT IN ('closed','expired')))`);
  for (const [key,column] of [['level','levels'],['field','fields'],['country','country_codes'],['funding','funding_categories']] as const) {
    const value = text(filters[key]);
    if (value) clauses.push(`${column} @> ARRAY[${bind(key === 'country' ? value.toUpperCase() : value)}]::text[]`);
  }
  for (const [key,column] of [['region','region'],['institution','institution_name'],['type','opportunity_type']] as const) {
    const value = text(filters[key]);
    if (value) clauses.push(`${column} = ${bind(value)}`);
  }
  if (text(filters.query)) clauses.push(`${SEARCH} @@ websearch_to_tsquery('simple', ${bind(text(filters.query))})`);
  if (filters.status) clauses.push(`(${STATUS}) = ${bind(filters.status)}`);
  const orders = { updated: 'updated_at DESC, id', published: 'published_at DESC NULLS LAST, id', deadline: 'deadline_at ASC NULLS LAST, id', title: 'title ASC, id' };
  const order = orders[filters.sort ?? 'updated'] ?? orders.updated;
  const where = clauses.join(' AND ');
  return read(async client => {
    const count = await client.query<{total: string}>(`SELECT count(*) AS total FROM opportunities WHERE ${where}`, values);
    const rows = await client.query<PublicOpportunity>(`SELECT ${COLUMNS} FROM opportunities WHERE ${where} ORDER BY ${order} LIMIT $${values.length+1} OFFSET $${values.length+2}`, [...values,pageSize,(page-1)*pageSize]);
    return { items: rows.rows, total: Number(count.rows[0].total), page, pageSize };
  });
}

export async function getPublicOpportunity(slug: string): Promise<PublicOpportunity | null> {
  if (!slug || slug.length > 200) return null;
  return read(async client => {
    const result = await client.query<PublicOpportunity>(`SELECT ${COLUMNS} FROM opportunities WHERE slug=$1 AND review_status='approved' AND duplicate_of IS NULL LIMIT 1`,[slug]);
    return result.rows[0] ?? null;
  });
}
