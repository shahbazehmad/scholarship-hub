export const reviewStates = ['pending', 'approved', 'rejected'];
export function httpUrl(value, required = false) {
  const text = String(value ?? '').trim();
  if (!text && !required) return null;
  let url;
  try { url = new URL(text); } catch { throw new Error('Enter a valid source URL'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Only HTTP(S) URLs without credentials are allowed');
  return url.href;
}
export function textField(value, max, required = false) {
  const text = String(value ?? '').trim();
  if ((required && !text) || text.length > max) throw new Error('Missing or oversized field');
  return text;
}
export function timestamp(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(text) || !Number.isFinite(Date.parse(text))) throw new Error('Use an ISO timestamp with an explicit timezone');
  const [date, time] = text.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.slice(0,5).split(':').map(Number);
  const calendar = new Date(0); calendar.setUTCFullYear(year,month-1,day);
  if (calendar.toISOString().slice(0,10) !== date || hour > 23 || minute > 59) throw new Error('Invalid calendar date or time');
  return new Date(text).toISOString();
}
export function mayEdit(role) { return role === 'editor' || role === 'admin'; }
export function assertApprovable(record, evidenceCount) {
  if (!record.title?.trim() || !record.description?.trim()) throw new Error('Title and description are required');
  httpUrl(record.announcement_url, true);
  httpUrl(record.application_url, true);
  if (record.duplicate_of) throw new Error('Resolve the duplicate before approval');
  if (record.verification_status !== 'admin_verified' || !record.last_verified_at || evidenceCount < 1) throw new Error('Explicit human verification and at least one evidence record are required');
}
