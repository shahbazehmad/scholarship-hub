import Link from 'next/link';
import StructuredFacts from '@/components/StructuredFacts';
import {withAdmin} from '@/lib/server/admin';
export default async function Observations(){
  const rows=await withAdmin(false,async db=>(await db.query('SELECT id,opportunity_id,source_url,fetched_at::text,extracted_record FROM public.source_observations ORDER BY fetched_at DESC,id LIMIT 50')).rows);
  return <><h2 className="text-2xl font-semibold">Latest source observations</h2><p>Unverified discovery snapshots, not confirmed facts. Existing listings are not overwritten by collection.</p>{!rows.length&&<p>No observations have been collected.</p>}{rows.map(r=><article key={r.id} className="space-y-3 rounded border p-4"><p className="break-all">{r.source_url}</p><p>{r.fetched_at}</p>{r.opportunity_id&&<Link href={`/admin/opportunities/${r.opportunity_id}`}>Review associated opportunity</Link>}<details><summary>Extracted claims</summary><StructuredFacts value={r.extracted_record}/></details></article>)}</>;
}
