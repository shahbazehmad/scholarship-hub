import Link from "next/link";
import Badge from "./Badge";
import CountryFlags from "./CountryFlags";
import ScholarshipLogo from "./ScholarshipLogo";
import { ArrowRightIcon, CalendarIcon } from "./Icons";
import {
  REGION_STYLES,
  daysLeft,
  deadlineLabel,
  getInitials,
  getLogoUrl,
  type Scholarship,
} from "@/lib/scholarships";

export default function ScholarshipCard({
  scholarship: s,
}: {
  scholarship: Scholarship;
}) {
  const avatar = REGION_STYLES[s.region] ?? REGION_STYLES.Global;
  const left = daysLeft(s);
  const urgent = left !== null && left <= 30;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl">
      <div className="flex items-start gap-3">
        <ScholarshipLogo
          src={getLogoUrl(s)}
          initials={getInitials(s.name)}
          fallbackClass={avatar}
          name={s.name}
        />
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-slate-900">
            <Link
              href={`/scholarships/${s.slug}`}
              className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-700"
            >
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
          <Badge key={l} variant="level">
            {l}
          </Badge>
        ))}
        {urgent && (
          <Badge variant="urgent">
            {left === 0 ? "Closes today" : `Closes in ${left} day${left === 1 ? "" : "s"}`}
          </Badge>
        )}
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {s.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="flex min-w-0 items-center gap-2">
          <CountryFlags scholarship={s} />
          <span className="truncate">{s.country}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <CalendarIcon className="h-4 w-4" /> {deadlineLabel(s)}
        </span>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
        View details
        <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </article>
  );
}
