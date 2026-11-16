import Link from 'next/link';
import { listReviewQueue } from '@/lib/server/admin';
export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const params = await searchParams;
  const result = await listReviewQueue(String(params.status ?? 'pending'),Number(params.page ?? 1));
  return <><p>Role: {result.admin.role}. {result.total} {result.status} records.</p><nav className="flex gap-4">{['pending','approved','rejected'].map(s=><Link key={s} href={`/admin?status=${s}`}>{s}</Link>)}</nav><div className="divide-y rounded border">{result.items.map(row=><article key={row.id} className="p-4"><Link className="font-semibold underline" href={`/admin/opportunities/${row.id}`}>{row.title}</Link><p>{row.review_status} · {row.verification_status}</p></article>)}</div>{result.items.length===0&&<p>No records in this queue.</p>}<nav className="flex gap-6">{result.page>1&&<Link href={`/admin?status=${result.status}&page=${result.page-1}`}>Previous</Link>}{result.page*25<result.total&&<Link href={`/admin?status=${result.status}&page=${result.page+1}`}>Next</Link>}</nav></>;
}
