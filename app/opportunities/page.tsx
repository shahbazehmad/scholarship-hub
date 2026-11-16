import Link from 'next/link';
import type { Metadata } from 'next';
import { searchOpportunities } from '@/lib/server/opportunities';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata: Metadata={title:'Verified opportunity directory',robots:{index:false,follow:false}};
export default async function Opportunities({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const p=await searchParams;
  const val=(key:string)=>typeof p[key]==='string'?p[key] as string:'';
  const filters={query:val('q'),level:val('level'),field:val('field'),country:val('country'),region:val('region'),institution:val('institution'),funding:val('funding'),type:val('type'),archive:val('archive')==='1',page:Number(val('page')||1),pageSize:12};
  const result=await searchOpportunities(filters);
  const link=(page:number)=>{const q=new URLSearchParams();for(const [k,v] of Object.entries(p))if(typeof v==='string')q.set(k,v);q.set('page',String(page));return `/opportunities?${q}`;};
  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-10"><h1 className="text-3xl font-bold">{filters.archive?'Opportunity archive':'Opportunity directory'}</h1><p>Database-backed preview. Only approved, non-duplicate records are displayed. Approval is not a guarantee of eligibility or funding.</p><form className="grid gap-3 sm:grid-cols-3">{[['q','Search'],['country','Country ISO code'],['level','Study level'],['field','Field'],['region','Region'],['institution','Institution'],['funding','Funding category'],['type','Opportunity type']].map(([key,label])=><label key={key}>{label}<input className="block w-full rounded border p-2" name={key} defaultValue={val(key)}/></label>)}<label><input type="checkbox" name="archive" value="1" defaultChecked={filters.archive}/> Search archived / closed opportunities</label><button className="rounded bg-blue-800 p-2 text-white">Search</button></form><p>{result.total} matching opportunities</p>{!result.items.length&&<p>No approved opportunities match these filters. Imported records awaiting review are not published here.</p>}<div className="grid gap-4 sm:grid-cols-2">{result.items.map(o=><article key={o.id} className="space-y-2 rounded-xl border p-5"><h2 className="text-xl font-semibold"><Link href={`/opportunities/${encodeURIComponent(o.slug)}`}>{o.title}</Link></h2><p>{o.institution_name??'Institution not confirmed'} · {o.countries.join(', ')||'Location not confirmed'}</p><p>{o.status} · {o.verification_status}</p><p>{o.description?.slice(0,220)}</p></article>)}</div><nav className="flex gap-6">{result.page>1&&<Link href={link(result.page-1)}>Previous</Link>}{result.page*result.pageSize<result.total&&<Link href={link(result.page+1)}>Next</Link>}</nav></div>;
}
