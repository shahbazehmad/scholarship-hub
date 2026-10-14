import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import {
  formatDate,
  getAllScholarships,
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

  const details: [string, string][] = [
    ["University / Organization", s.organization],
    ["Country", s.country],
    ["Level of study", s.levels.join(", ")],
    ["Deadline", formatDate(s.deadline)],
    ["Funding / Coverage", s.funding],
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/scholarships" className="text-sm text-brand-700 hover:underline">
        &larr; Back to all scholarships
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={s.fundingType === "Fully Funded" ? "funding" : "partial"}>
          {s.fundingType}
        </Badge>
        <Badge variant="deadline">Deadline: {formatDate(s.deadline)}</Badge>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        {s.name}
      </h1>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">About this scholarship</h2>
          <p className="mt-3 leading-relaxed text-slate-700">{s.description}</p>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <dl className="space-y-4 text-sm">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="font-medium text-slate-500">{label}</dt>
                <dd className="mt-0.5 text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={s.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-lg bg-brand-700 px-4 py-3 text-center font-semibold text-white hover:bg-brand-800"
          >
            Apply Now / Official Source
          </a>
        </aside>
      </div>
    </div>
  );
}
