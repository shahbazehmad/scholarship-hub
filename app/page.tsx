import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import ScholarshipCard from "@/components/ScholarshipCard";
import SectionHeading from "@/components/SectionHeading";
import { CapIllustration, GlobeLines, Skyline } from "@/components/HeroArt";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  FlameIcon,
  GlobeIcon,
  PinIcon,
  SearchIcon,
  StarIcon,
} from "@/components/Icons";
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
const POPULAR = ["Germany", "UK", "Japan", "PhD"];

export default function HomePage() {
  const featured = getFeaturedScholarships(6);
  const recent = getRecentScholarships(6);
  const closing = getClosingSoon(3);
  const stats = getStats();

  const statItems = [
    { label: "Opportunities", value: stats.total, icon: BriefcaseIcon },
    { label: "Host countries", value: stats.countries, icon: GlobeIcon },
    { label: "Fully funded", value: stats.fullyFunded, icon: StarIcon },
    { label: "World regions", value: stats.regions, icon: PinIcon },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#021640] via-[#0a3a8f] to-[#1f74e6] text-white">
        <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0 opacity-60" />
        <GlobeLines className="pointer-events-none absolute -right-24 -top-16 h-[30rem] w-[30rem] text-white/15" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-sky-400/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-36 pt-12 sm:px-6 sm:pb-40 sm:pt-20 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur">
            <GlobeIcon className="h-5 w-5" /> Scholarships, grants and fellowships worldwide
          </p>
          <h1 className="mt-8 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Find Your Fully Funded{" "}
            <span className="text-sky-400">Dream</span> Scholarship
          </h1>
          <p className="mt-6 max-w-[85%] text-lg leading-relaxed text-blue-50 sm:max-w-2xl">
            Explore trusted opportunities for Bachelor, Master, PhD and postdoctoral study, with links straight to the official source. Listings refresh every night and expired deadlines are removed automatically.
          </p>
          <div className="mt-8 h-1 w-24 rounded-full bg-sky-400" />

          <CapIllustration className="pointer-events-none absolute -right-10 bottom-28 w-52 drop-shadow-2xl sm:right-6 sm:w-72 lg:right-24 lg:w-[26rem]" />
        </div>

        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute bottom-0 left-0 h-16 w-full sm:h-24"
        >
          <path d="M0 70C220 130 440 10 720 56s560 70 720 6V120H0Z" fill="#f8fafc" />
        </svg>
      </section>

      <section className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 sm:-mt-28 sm:px-6 lg:px-8">
        <HeroSearch />
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-1 inline-flex items-center gap-1.5 font-bold text-brand-800">
            <FlameIcon className="h-5 w-5 text-brand-600" /> Popular:
          </span>
          {POPULAR.map((t) => (
            <Link
              key={t}
              href={`/scholarships?q=${encodeURIComponent(t)}`}
              className="rounded-full bg-blue-100/80 px-4 py-2 font-medium text-brand-800 ring-1 ring-blue-200 transition hover:bg-blue-200"
            >
              {t}
            </Link>
          ))}
          <Link
            href="/scholarships?funding=Fully%20Funded"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-4 py-2 font-medium text-brand-800 ring-1 ring-blue-200 transition hover:bg-blue-200"
          >
            <StarIcon className="h-4 w-4 text-brand-600" /> Fully Funded
          </Link>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl md:grid-cols-4 md:gap-y-0">
          {statItems.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center ${i > 0 ? "md:border-l md:border-slate-200" : ""} ${i % 2 === 1 ? "border-l border-slate-200 md:border-l" : ""}`}
            >
              <s.icon className="h-9 w-9 text-brand-600" />
              <dd className="mt-2 text-3xl font-extrabold text-brand-900 sm:text-4xl">{s.value}</dd>
              <dt className="mt-0.5 text-sm font-medium text-slate-600">{s.label}</dt>
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
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{i + 1}. {t}</h3>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#021640] via-[#0a3a8f] to-[#1f74e6] p-10 text-center text-white sm:p-14">
          <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to start your journey?</h2>
            <p className="mx-auto mt-2 max-w-xl text-blue-50">Browse every scholarship, grant and fellowship in one searchable list.</p>
            <Link href="/scholarships" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-800 shadow-lg transition hover:bg-blue-50">
              Browse all scholarships <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div aria-hidden className="mx-auto mt-12 max-w-5xl px-4">
        <Skyline className="h-auto w-full" />
      </div>
    </>
  );
}
