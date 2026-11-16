'use client';
export default function DirectoryError({reset}:{reset:()=>void}){return <div className="mx-auto max-w-4xl space-y-4 px-4 py-10"><h1>Opportunity directory temporarily unavailable</h1><p>The database could not be read. Unreviewed JSON records have not been substituted.</p><button className="rounded border p-2" onClick={reset}>Try again</button></div>;}
