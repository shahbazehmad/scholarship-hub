export function httpUrl(value) {
  if (typeof value !== 'string') return null;
  try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; }
}

export function normalizeLegacy(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error('Invalid record');
  if (typeof record.slug !== 'string' || !record.slug.trim()) throw new Error('Missing slug');
  if (typeof record.name !== 'string' || !record.name.trim()) throw new Error(`Missing title: ${record.slug}`);
  const sourceUrl = httpUrl(record.sourceUrl) || httpUrl(record.officialUrl);
  if (!sourceUrl) throw new Error(`Missing traceable source: ${record.slug}`);
  return {
    slug: record.slug, title: record.name,
    institution_name: record.autoAdded ? null : (record.organization || null),
    countries: typeof record.country === 'string' && !/^(multiple|worldwide|global)/i.test(record.country) ? [record.country] : [],
    country_codes: Array.isArray(record.countryCodes) ? record.countryCodes.filter(c => typeof c === 'string' && /^[a-z]{2}$/i.test(c)).map(c => c.toUpperCase()) : [],
    region: record.region || null,
    levels: [], fields: [], funding_categories: [],
    opportunity_type: null,
    description: typeof record.description === 'string' ? record.description : null,
    logo_url: typeof record.logo === 'string' && record.logo.startsWith('/') && !record.logo.startsWith('//') ? record.logo : httpUrl(record.logo),
    image_urls: Array.isArray(record.imageUrls) ? record.imageUrls.map(httpUrl).filter(Boolean) : [],
    original_source_name: record.source || null, original_source_url: sourceUrl,
    source_type: record.autoAdded ? 'aggregator' : null,
    application_details: { legacyAnnouncementUrl: httpUrl(record.officialUrl), legacyDeadline: record.deadline ?? null, legacyDeadlineNote: record.deadlineNote ?? null },
    legacy_record: record
  };
}
