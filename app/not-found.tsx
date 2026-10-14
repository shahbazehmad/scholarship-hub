import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">That scholarship or page does not exist.</p>
      <Link href="/scholarships" className="mt-6 inline-block rounded-lg bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800">
        Browse scholarships
      </Link>
    </div>
  );
}
