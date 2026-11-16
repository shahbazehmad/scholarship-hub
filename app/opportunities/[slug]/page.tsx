import Link from 'next/link';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import StructuredFacts from '@/components/StructuredFacts';
import {getPublicOpportunity} from '@/lib/server/opportunities';
import {httpUrl} from '@/lib/domain/review.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const o=await getPublicOpportunity((await params).slug);return {title:o?.title??'Opportunity not found',description:o?.description?.slice(0,155),robots:{index:false,follow:false}};}
function safe(value:string|null){try{return httpUrl(value);}catch{return null;}}
export default async function Opportunity({params}:{params:Promise<{slug:string}>}){
  const o=await getPublicOpportunity((await params).slug);if(!o)notFound();
  const links=[['Official application website',safe(o.application_url)],['Official announcement',safe(o.announcement_url)],['Original source (not necessarily official)',safe(o.original_source_url)]];
  const facts=[['Institution',o.institution_name],['Countries',o.countries.join(', ')],['Levels',o.levels.join(', ')],['Fields',o.fields.join(', ')],['Deadline',o.deadline_at?new Date(o.deadline_at).toISOString():'Not confirmed'],['Last verified',o.last_verified_at?new Date(o.last_verified_at).toISOString():'Not verified']];
  return <article className="mx-auto max-w-4xl space-y-6 px-4 py-10"><Link href="/opportunities">Back to directory</Link><h1 className="text-3xl font-bold">{o.title}</h1><p>{o.status} · {o.verification_status}</p>{['Closed','Expired'].includes(o.status)&&<aside className="rounded border border-amber-400 bg-amber-50 p-4">Historical listing. Do not assume applications are currently open.</aside>}<dl className="grid gap-4 sm:grid-cols-2">{facts.map(([label,value])=><div key={label}><dt className="font-semibold">{label}</dt><dd>{value||'Not confirmed'}</dd></div>)}</dl><section><h2 className="text-xl font-semibold">About this opportunity</h2><p className="whitespace-pre-wrap">{o.description??'Not confirmed'}</p></section>{[['Funding',o.funding_details],['Eligibility',o.eligibility],['How to apply',o.application_details]].map(([label,value])=><section className="rounded border p-5" key={String(label)}><h2 className="mb-3 text-xl font-semibold">{String(label)}</h2><StructuredFacts value={value}/></section>)}<nav className="flex flex-wrap gap-5">{links.map(([label,url])=>url?<a key={label} href={url} target="_blank" rel="noopener noreferrer">{label}</a>:null)}</nav><p>Confirm funding, eligibility and deadlines directly with the institution. Approval is not a guarantee of funding or admission.</p></article>;
}
