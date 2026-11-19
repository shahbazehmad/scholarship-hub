import {readFileSync, writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const path = 'data/scholarships.json';
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const existing = read(path), queue = read('data/reviewed-publications.json');
assert(Array.isArray(existing) && Array.isArray(queue));
const bySlug = new Map(existing.map(row => [row.slug, row]));
const seen = new Set();
const additions = [];
const today = new Date().toISOString().slice(0, 10);
for (const row of queue) {
  assert(row && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug ?? ''), 'Invalid slug');
  assert(!seen.has(row.slug), `Duplicate queue slug: ${row.slug}`);
  seen.add(row.slug);
  const {addedAt: ignored, ...fields} = row;
  if (bySlug.has(row.slug)) {
    const {addedAt: previous, ...published} = bySlug.get(row.slug);
    assert.deepEqual(fields, published, `Existing slug cannot be overwritten: ${row.slug}`);
    continue;
  }
  for (const key of ['name','organization','country','region','funding','deadlineNote','eligibility','description','officialUrl']) assert(typeof row[key] === 'string' && row[key].trim(), `Missing ${key}: ${row.slug}`);
  assert(['Scholarship','Grant','Fellowship'].includes(row.type));
  assert(['Fully Funded','Partial'].includes(row.fundingType));
  assert(Array.isArray(row.levels) && row.levels.length && row.levels.every(v => typeof v === 'string' && v.trim()));
  assert(Array.isArray(row.tags) && row.tags.every(v => typeof v === 'string'));
  assert(typeof row.featured === 'boolean' && !row.autoAdded);
  const url = new URL(row.officialUrl);
  assert(url.protocol === 'https:' && !url.username && !url.password);
  if (row.deadline !== null) {
    assert(typeof row.deadline === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(row.deadline));
    assert(new Date(`${row.deadline}T00:00:00Z`).toISOString().slice(0,10) === row.deadline);
    assert(row.deadline >= today, `Deadline already passed: ${row.slug}`);
  }
  additions.push({...fields, addedAt: today});
}
if (additions.length) writeFileSync(path, JSON.stringify([...existing, ...additions], null, 2) + '\n');
console.log(`New publications: ${additions.length}`);
