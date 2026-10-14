import Link from "next/link";
import ScholarshipCard from "@/components/ScholarshipCard";
import {
  getFeaturedScholarships,
  getRecentScholarships,
} from "@/lib/scholarships";

export default function HomePage() {
  const featured = getFeaturedScholarships();
  const recent = getRecentScholarships(3);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find Your Fully Funded Dream Scholarship
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Search curated Bachelor, Master and PhD opportunities from trusted
            official sources, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/scholarships"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-brand-800 hover:bg-blue-50"
            >
              Browse Scholarships
            </Link>
            <Link
              href="/scholarships"
              className="rounded-lg border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Search by keyword
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">Featured Scholarships</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">Recently Added</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="rounded-2xl bg-brand-50 p-8 text-center ring-1 ring-brand-100">
          <h2 className="text-2xl font-bold text-brand-900">
            Ready to start your journey?
          </h2>
          <p className="mt-2 text-slate-600">
            Filter by level, region and funding type to find your best match.
          </p>
          <Link
            href="/scholarships"
            className="mt-5 inline-block rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800"
          >
            Browse all scholarships
          </Link>
        </div>
      </section>
    </>
  );
}
