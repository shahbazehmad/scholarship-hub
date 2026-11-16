import type {Metadata} from 'next';
import {Suspense} from 'react';
import Link from 'next/link';
import ScholarshipExplorer from '@/components/ScholarshipExplorer';
import {legacyCatalog} from '@/lib/legacy-catalog';
export const revalidate=3600;
export const metadata:Metadata={title:'Explore scholarships, grants and fellowships',description:'Search legacy opportunity listings by keyword, level, region and source funding label. Confirm details with the provider.'};
export default function ScholarshipsPage(){return <div className="ui-container py-10 sm:py-14"><p className="ui-eyebrow">Explore the possibilities</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">Find your next opportunity</h1><p className="mt-4 max-w-3xl leading-7 text-slate-600">Compare scholarships, grants and fellowships. A listing or future source date does not establish that applications are open.</p><div className="my-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Legacy directory: source claims have not completed the new verification workflow. <Link className="underline" href="/archive">View preserved past-deadline records</Link>.</div><Suspense fallback={<p role="status">Loading search controls…</p>}><ScholarshipExplorer scholarships={legacyCatalog()}/></Suspense></div>;}
