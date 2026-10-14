import Link from "next/link";
import Badge from "./Badge";
import { formatDate, type Scholarship } from "@/lib/scholarships";

export default function ScholarshipCard({
  scholarship: s,
}: {
  scholarship: Scholarship;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge variant={s.fundingType === "Fully Funded" ? "funding" : "partial"}>
          {s.fundingType}
        </Badge>
        {s.levels.map((l) => (
          <Badge key={l} variant="level">
            {l}
          </Badge>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/scholarships/${s.slug}`} className="hover:text-brand-700">
          {s.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-slate-600">{s.organization}</p>
      <p className="mt-1 text-sm text-slate-500">{s.country}</p>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">
        {s.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <Badge variant="deadline">Deadline: {formatDate(s.deadline)}</Badge>
        <Link
          href={`/scholarships/${s.slug}`}
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
