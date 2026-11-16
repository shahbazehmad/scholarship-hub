'use client';
import Link from 'next/link';
export default function CatalogError({reset}:{reset:()=>void}){return <section className="ui-container py-14"><div className="ui-panel p-8"><h1 className="ui-heading">We could not load this view</h1><p className="my-5 text-slate-600">Please try again. No application or payment has been submitted through this directory.</p><div className="flex flex-wrap gap-4"><button className="ui-button" onClick={reset}>Try again</button><Link className="ui-secondary" href="/scholarships">Return to directory</Link></div></div></section>;}
