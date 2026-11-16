import test from 'node:test';
import assert from 'node:assert/strict';
import {deadlineState} from '../lib/domain/catalog.mjs';
test('past dates belong in preserved archive',()=>assert.equal(deadlineState('2026-01-01','2026-11-16'),'past'));
test('today and future source dates do not establish open applications',()=>{assert.equal(deadlineState('2026-11-16','2026-11-16'),'listed');assert.equal(deadlineState('2027-01-01','2026-11-16'),'listed');});
test('absent or invalid dates stay unknown',()=>{for(const value of [null,'','2026-02-30','not-a-date'])assert.equal(deadlineState(value,'2026-11-16'),'unknown');});
