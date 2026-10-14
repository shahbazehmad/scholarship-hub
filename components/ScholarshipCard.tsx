import Link from "next/link";
import Badge from "./Badge";
import { ArrowRightIcon, CalendarIcon, GlobeIcon } from "./Icons";
import {
  REGION_STYLES,
  deadlineLabel,
  type Scholarship,
} from "@/lib/scholarships";

function initials(name: string) {
  return name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ScholarshipCard({
  scholarship: s,
}: {
  scholarship: Scholarship;
}) {
  const avatar = REGION_STYLES[s.region] ?? REGION_STYLES.Global;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${avatar}`}>
          {initials(s.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-slate-900">
            <Link href={`/scholarships/${s.slug}`} className="after:absolute hover:text-brand-700">
              {s.name}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-500">{s.organization}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge variant={s.fundingType === "Fully Funded" ? "funding" : "partial"}>
          {s.fundingType}
        </Badge>
        <Badge variant="type">{s.type}</Badge>
        {s.levels.map((l) => (
          <Badge key={l} variant="level">{l}</Badge>
        ))}
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {s.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <GlobeIcon className="h-4 w-4" /> {s.country}
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" /> {deadlineLabel(s)}
        </span>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
        View details
        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </article>
  );
}
