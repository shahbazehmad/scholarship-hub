import {readFile, writeFile, appendFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {canonicalUrl, fingerprint, parseFeed} from '../lib/domain/completion.mjs';

export function mergeDiscoveries(existing, feeds, today = new Date().toISOString().slice(0,10)) {
  if (!Array.isArray(existing)) throw new Error('Catalog must be an array');
  const keys = new Set();
  for (const row of existing) {
    keys.add(`slug:${row.slug}`);
    keys.add(`title:${String(row.name).toLowerCase().replace(/[^a-z0-9]/g,'')}`);
    for (const value of [row.sourceUrl, row.officialUrl]) {
      try { keys.add(canonicalUrl(value)); } catch {}
    }
  }
  const added = [];
  for (const {source, records} of feeds) {
    const host = new URL(canonicalUrl(source.feed)).hostname.replace(/^www\./,'');
    for (const item of records) {
      if (added.length >= 15) break;
      if (!/\b(scholarships?|fellowships?|grants?|bursar(?:y|ies)|stipends?|funded|funding)\b/i.test(item.title)) continue;
      let url;
      try { url = canonicalUrl(item.url); } catch { continue; }
      if (new URL(url).hostname.replace(/^www\./,'') !== host) continue;
      const titleKey = `title:${item.title.toLowerCase().replace(/[^a-z0-9]/g,'')}`;
      const base = item.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,65) || 'opportunity';
      const slug = `${base}-${fingerprint(url).slice(0,12)}`;
      if (keys.has(url) || keys.has(titleKey) || keys.has(`slug:${slug}`)) continue;
      added.push({slug, name:item.title, organization:source.name, country:'Not confirmed', region:'Global',
        type:/fellowship/i.test(item.title)?'Fellowship':/\bgrant\b/i.test(item.title)?'Grant':'Scholarship',
        levels:['Not confirmed'], fundingType:'Not confirmed', funding:'Funding has not been independently confirmed. Read the original source.',
        deadline:null, deadlineNote:'No verified deadline recorded. This discovery is not confirmation that applications are open.',
        eligibility:'Not independently confirmed. Consult the provider.', addedAt:today, featured:false, tags:[],
        description:`${item.description.slice(0,600)}${item.description.length>600?'…':''} (Unverified discovery from ${source.name}; confirm current dates and details with the provider.)`,
        officialUrl:url, autoAdded:true, source:source.name, sourceUrl:url});
      keys.add(url); keys.add(titleKey); keys.add(`slug:${slug}`);
    }
  }
  return [...existing, ...added];
}

async function collect(source) {
  const response = await fetch(canonicalUrl(source.feed), {redirect:'error', signal:AbortSignal.timeout(20000), headers:{'User-Agent':'ScholarshipHubDiscovery/2.0 (+https://github.com/shahbazehmad/scholarship-hub)'}});
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  let size=0; const chunks=[];
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size>2000000) throw new Error('Feed exceeds 2MB limit');
    chunks.push(Buffer.from(chunk));
  }
  const records = parseFeed(Buffer.concat(chunks).toString('utf8'));
  if (!records.length) throw new Error('No parseable RSS entries');
  return {source, records};
}

async function main() {
  const original = await readFile('data/scholarships.json','utf8');
  const existing = JSON.parse(original);
  const sources = JSON.parse(await readFile('scripts/sources.json','utf8'));
  if (!Array.isArray(sources) || !sources.length) throw new Error('No configured feeds');
  const feeds=[]; const report=[];
  for (const source of sources) {
    try {
      const feed=await collect(source); feeds.push(feed);
      report.push(`${source.name}: ${feed.records.length} parsed entries`);
    } catch (error) {
      report.push(`${source.name}: FAILED (${error.message})`);
      console.warn(`::warning::Feed failed: ${source.name}`);
    }
  }
  if (!feeds.length) throw new Error(`All configured feeds failed; catalog unchanged. ${report.join('; ')}`);
  const result=mergeDiscoveries(existing,feeds);
  if (result.length>existing.length) await writeFile('data/scholarships.json',JSON.stringify(result,null,2)+'\n');
  const summary=`## Daily RSS collection\n${report.map(line=>`- ${line}`).join('\n')}\n\nAdded: ${result.length-existing.length}. Preserved: ${existing.length}. Deleted: 0.\nNew entries are unverified discoveries, not approved database records.\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,summary);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
