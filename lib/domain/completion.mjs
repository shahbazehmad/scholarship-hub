import {createHash} from 'node:crypto';
export function list(value, upper=false) {
  const result=[...new Set(String(value??'').split(',').map(x=>x.trim()).filter(Boolean))];
  if(result.length>50||result.some(x=>x.length>150))throw new Error('Too many or oversized values');
  return upper?result.map(x=>x.toUpperCase()):result;
}
export function object(value) {
  const text=String(value??'').trim()||'{}';
  if(text.length>30000)throw new Error('Structured field is too large');
  const data=JSON.parse(text);
  if(!data||Array.isArray(data)||typeof data!=='object')throw new Error('Expected a JSON object');
  return data;
}
export function canonicalUrl(value) {
  const u=new URL(String(value));
  if(u.protocol!=='https:'||u.username||u.password)throw new Error('HTTPS URLs without credentials are required');
  u.hash='';
  for(const key of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid)$/i.test(key))u.searchParams.delete(key);
  u.searchParams.sort();return u.href;
}
export const fingerprint=value=>createHash('sha256').update(value).digest('hex');
const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&amp;/g,'&');
const plain=s=>decode(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
export function parseFeed(xml) {
  if(Buffer.byteLength(xml)>2000000||/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error('Unsupported or oversized XML');
  if(!/<rss[\s>]/i.test(xml))throw new Error('Only RSS feeds are supported');
  const tag=(block,name)=>decode(block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`,'i'))?.[1]??'').trim();
  const rows=[];
  for(const block of (xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)??[]).slice(0,100)) {
    try {
      const title=plain(tag(block,'title')).slice(0,500), url=canonicalUrl(tag(block,'link'));
      if(!title)continue;
      rows.push({title,url,description:plain(tag(block,'description')).slice(0,20000)});
    }catch{}
  }
  return rows;
}
