import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

export default function SectionHeading({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:flex">
          View all <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
