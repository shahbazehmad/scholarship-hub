'use client';
export default function AdminError({ reset }: { reset: () => void }) {
  return <section className="space-y-4"><h2>Admin request could not be completed</h2><p>Check your membership and configuration. For edits, reload the record to obtain its latest version. Do not resubmit blindly.</p><button onClick={reset} className="rounded border px-4 py-2">Reload view</button></section>;
}
