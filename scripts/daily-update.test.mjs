import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeDiscoveries} from './update-listings.mjs';
const source={name:'Example',feed:'https://example.org/feed/'};
const item={title:'Research scholarship',url:'https://example.org/research?utm_source=rss',description:'Source summary'};
const feed=records=>[{source,records}];
test('preserves expired and existing entries unchanged',()=>{
  const old={slug:'old',name:'Old listing',deadline:'2020-01-01',officialUrl:'https://example.org/old'};
  const before=JSON.stringify(old);
  const result=mergeDiscoveries([old],feed([item]),'2026-11-20');
  assert.equal(result.length,2);assert.deepEqual(result[0],old);assert.equal(JSON.stringify(old),before);
});
test('repeat runs and tracking URLs do not duplicate discoveries',()=>{
  const once=mergeDiscoveries([],feed([item,item]),'2026-11-20');
  assert.equal(once.length,1);assert.deepEqual(mergeDiscoveries(once,feed([item]),'2026-11-21'),once);
});
test('same titles do not republish existing listings',()=>{
  const old={slug:'existing',name:item.title};
  assert.deepEqual(mergeDiscoveries([old],feed([item])),[old]);
});
test('new source claims do not invent funding, location or deadlines',()=>{
  const [row]=mergeDiscoveries([],feed([item]),'2026-11-20');
  assert.equal(row.fundingType,'Not confirmed');assert.equal(row.deadline,null);
  assert.equal(row.country,'Not confirmed');assert.equal(row.autoAdded,true);assert.equal(row.featured,false);
});
test('rejects irrelevant and off-source links',()=>{
  assert.deepEqual(mergeDiscoveries([],feed([{...item,title:'General news'},{...item,url:'https://other.example/post'},{...item,url:'javascript:alert(1)'}])),[]);
});
test('caps daily additions at fifteen',()=>{
  const rows=Array.from({length:30},(_,i)=>({...item,title:`Scholarship ${i}`,url:`https://example.org/${i}`}));
  assert.equal(mergeDiscoveries([],feed(rows)).length,15);
});
