import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Administration', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-10"><h1 className="text-3xl font-bold">Opportunity administration</h1><p><a href="/admin">Review queue</a> · <a href="/api/auth/signout">Sign out</a></p>{children}</div>;
}
