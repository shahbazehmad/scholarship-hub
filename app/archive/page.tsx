import type {Metadata} from 'next';
import {Suspense} from 'react';
import Link from 'next/link';
import ScholarshipExplorer from '@/components/ScholarshipExplorer';
import {legacyCatalog} from '@/lib/legacy-catalog';
export const revalidate=3600;
export const metadata:Metadata={title:'Preserved opportunity archive',robots:{index:false,follow:true}};
export default function ArchivePage(){return <div className="ui-container py-12"><p className="ui-eyebrow">Keep the context</p><h1 className="ui-heading">Preserved opportunity archive</h1><p className="mb-8 mt-4 max-w-3xl leading-7 text-slate-600">Records in the current dataset with past source-listed deadlines. This is not a recovered history of entries previously deleted by the old updater. Do not assume applications are open. <Link href="/scholarships" className="font-semibold text-brand-700 underline">Return to the current directory</Link>.</p><Suspense fallback={<p role="status">Loading archive filters…</p>}><ScholarshipExplorer scholarships={legacyCatalog(true)} basePath="/archive"/></Suspense></div>;}
