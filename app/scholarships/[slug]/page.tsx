import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import ScholarshipCard from "@/components/ScholarshipCard";
import { ExternalIcon } from "@/components/Icons";
import {
  deadlineLabel,
  getAllScholarships,
  getRelated,
  getScholarshipBySlug,
} from "@/lib/scholarships";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllScholarships().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getScholarshipBySlug(slug);
  if (!s) return {};
  return { title: s.name, description: s.description.slice(0, 155) };
}

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const s = getScholarshipBySlug(slug);
  if (!s) notFound();

  const related = getRelated(s, 3);
  const facts: [string, string][] = [
    ["University / Organization", s.organization],
    ["Country", s.country],
    ["Region", s.region],
    ["Level of study", s.levels.join(", ")],
    ["Deadline", deadlineLabel(s)],
    ["Funding type", s.fundingType],
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-blue-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/scholarships" className="hover:text-white">Scholarships</Link>
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant={s.fundingType === "Fully Funded" ? "funding" : "partial"}>{s.fundingType}</Badge>
            <Badge variant="type">{s.type}</Badge>
            {s.levels.map((l) => (
              <Badge key={l} variant="level">{l}</Badge>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{s.name}</h1>
          <p className="mt-2 text-lg text-blue-100">{s.organization} &middot; {s.country}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">About this opportunity</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{s.description}</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Funding and coverage</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{s.funding}</p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">Eligibility</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{s.eligibility}</p>
          </section>
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-900">Deadline</h2>
            <p className="mt-2 text-amber-900">{s.deadlineNote}</p>
            <p className="mt-2 text-sm text-amber-800">Dates change each year. Confirm on the official website.</p>
          </section>
        </div>

        <aside className="h-fit space-y-4 md:sticky md:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <dl className="space-y-4 text-sm">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={s.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-3 text-center font-semibold text-white shadow-sm hover:bg-brand-800"
            >
              Apply Now / Official Source <ExternalIcon className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Related opportunities</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <div key={r.slug} className="relative">
                <ScholarshipCard scholarship={r} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
