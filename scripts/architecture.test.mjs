import test from 'node:test';
import assert from 'node:assert/strict';
import { httpUrl, timestamp, textField, mayEdit, assertApprovable } from '../lib/domain/review.mjs';
const record = { title: 'Example', description: 'Description', announcement_url: 'https://example.org/notice', application_url: 'https://example.org/apply', verification_status: 'admin_verified', last_verified_at: '2026-11-16T10:00:00Z', duplicate_of: null };
test('URL validation rejects active schemes and credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', 'https://user:pass@example.org']) assert.throws(() => httpUrl(url));
  assert.equal(httpUrl('https://example.org'), 'https://example.org/');
  assert.equal(httpUrl(''), null);
  assert.throws(() => httpUrl('', true));
});
test('dates require explicit timezone', () => {
  assert.throws(() => timestamp('2026-12-01T10:00'));
  assert.throws(() => timestamp('2026-02-30T10:00Z'));
  assert.throws(() => timestamp('2026-12-01T24:00Z'));
  assert.equal(timestamp('2026-12-01T12:00+02:00'), '2026-12-01T10:00:00.000Z');
  assert.equal(timestamp(''), null);
});
test('reviewers cannot edit', () => {
  assert.equal(mayEdit('reviewer'), false);
  assert.equal(mayEdit('editor'), true);
  assert.equal(mayEdit('admin'), true);
  assert.equal(mayEdit('unknown'), false);
});
test('approval requires human verification, evidence and sources', () => {
  assert.doesNotThrow(() => assertApprovable(record, 1));
  for (const patch of [{ verification_status: 'needs_review' }, { last_verified_at: null }, { duplicate_of: 'other' }, { application_url: null }, { description: '' }]) assert.throws(() => assertApprovable({ ...record, ...patch }, 1));
  assert.throws(() => assertApprovable(record, 0));
});
test('text length and required fields are validated', () => {
  assert.equal(textField(' x ', 2, true), 'x');
  assert.throws(() => textField('', 2, true));
  assert.throws(() => textField('abc', 2));
});
