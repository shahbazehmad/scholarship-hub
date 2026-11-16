import test from 'node:test';
import assert from 'node:assert/strict';
import {list,object,canonicalUrl,fingerprint,parseFeed} from '../lib/domain/completion.mjs';
test('lists are deduplicated and country codes normalized',()=>{assert.deepEqual(list('de, fr,de',true),['DE','FR']);assert.throws(()=>list('x'.repeat(151)));});
test('structured values must be bounded objects',()=>{assert.deepEqual(object(''),{});for(const s of ['null','[]','not-json','"x"'])assert.throws(()=>object(s));});
test('canonical URLs reject active schemes, credentials and remove trackers',()=>{assert.equal(canonicalUrl('https://example.org/a?utm_source=x&b=2#a'),'https://example.org/a?b=2');for(const s of ['http://example.org','javascript:x','https://u:p@example.org'])assert.throws(()=>canonicalUrl(s));});
test('RSS discovery preserves claims without inferring funding or dates',()=>{const rows=parseFeed('<rss><channel><item><title><![CDATA[Example scholarship]]></title><link>https://example.org/a</link><description>Fully funded, deadline tomorrow</description></item></channel></rss>');assert.equal(rows.length,1);assert.deepEqual(Object.keys(rows[0]),['title','url','description']);assert.equal(rows[0].title,'Example scholarship');});
test('unsafe or unsupported feeds are rejected',()=>{for(const s of ['<!DOCTYPE rss><rss/>','<!ENTITY x "y"><rss/>','<feed/>'])assert.throws(()=>parseFeed(s));assert.equal(fingerprint('x'),fingerprint('x'));});
