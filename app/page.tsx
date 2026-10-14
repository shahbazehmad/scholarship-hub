import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import ScholarshipCard from "@/components/ScholarshipCard";
import SectionHeading from "@/components/SectionHeading";
import { ArrowRightIcon, GlobeIcon, SearchIcon, CheckIcon } from "@/components/Icons";
import {
  getClosingSoon,
  getFeaturedScholarships,
  getRecentScholarships,
  getStats,
} from "@/lib/scholarships";

// Rebuild the static page at most once per hour so expired listings drop out.
export const revalidate = 3600;

const LEVELS = ["Bachelor", "Master", "PhD", "Postdoc"];
const REGIONS = ["Europe", "North America", "Asia", "Africa", "Oceania", "Middle East", "Latin America", "Global"];

export default function HomePage() {
  const featured = getFeaturedScholarships(6);
  const recent = getRecentScholarships(6);
  const closing = getClosingSoon(3);
  const stats = getStats();

  const statItems = [
    { label: "Opportunities", value: stats.total },
    { label: "Host countries", value: stats.countries },
    { label: "Fully funded", value: stats.fullyFunded },
    { label: "World regions", value: stats.regions },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white">
        <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/30">
            <GlobeIcon className="h-4 w-4" /> Scholarships, grants and fellowships worldwide
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-6xl">
            Find Your Fully Funded{" "}
            <span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">
              Dream Scholarship
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-blue-50">
            Explore trusted opportunities for Bachelor, Master, PhD and postdoctoral study, with links straight to the official source. Listings refresh every night and expired deadlines are removed automatically.
          </p>
          <HeroSearch />
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-blue-100">Popular:</span>
            {["Germany", "UK", "Japan", "PhD", "Fully Funded"].map((t) => (
              <Link
                key={t}
                href={`/scholarships?q=${encodeURIComponent(t)}`}
                className="rounded-full bg-white/15 px-3 py-1 font-medium text-white ring-1 ring-white/30 transition hover:bg-white/25"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:grid-cols-4">
          {statItems.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="text-3xl font-extrabold text-brand-800 sm:text-4xl">{s.value}</dd>
              <dt className="mt-1 text-sm font-medium text-slate-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {closing.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <SectionHeading title="Closing Soon" subtitle="Apply before these deadlines pass." href="/scholarships" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {closing.map((s) => (
              <ScholarshipCard key={s.slug} scholarship={s} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading title="Featured Scholarships" subtitle="Top opportunities handpicked for global students." href="/scholarships" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading title="Browse by Level and Region" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Level of study</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <Link key={l} href={`/scholarships?level=${l}`} className="rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100">
                  {l}
                </Link>
              ))}
              <Link href="/scholarships?type=Grant" className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100">Grants</Link>
              <Link href="/scholarships?type=Fellowship" className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100">Fellowships</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Region</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Link key={r} href={`/scholarships?region=${encodeURIComponent(r)}`} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  {r}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading title="Recently Added" subtitle="The newest listings in the directory." href="/scholarships" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeading title="How It Works" />
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { icon: SearchIcon, t: "Search and filter", d: "Narrow by level, region, country, funding type or keyword." },
            { icon: CheckIcon, t: "Check eligibility", d: "Read the coverage, eligibility and deadline summary on each page." },
            { icon: ArrowRightIcon, t: "Apply at the source", d: "Go straight to the official website to submit your application." },
          ].map(({ icon: Icon, t, d }, i) => (
            <li key={t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{i + 1}. {t}</h3>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 to-brand-600 p-10 text-center text-white sm:p-14">
          <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0" />
          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to start your journey?</h2>
            <p className="mx-auto mt-2 max-w-xl text-blue-50">Browse every scholarship, grant and fellowship in one searchable list.</p>
            <Link href="/scholarships" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-brand-800 shadow-lg transition hover:bg-blue-50">
              Browse all scholarships <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
