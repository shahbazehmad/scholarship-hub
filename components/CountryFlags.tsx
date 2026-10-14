import { GlobeIcon } from "./Icons";
import { getCountryCodes } from "@/lib/countries";
import type { Scholarship } from "@/lib/scholarships";

export default function CountryFlags({
  scholarship: s,
  className = "h-4 w-6",
}: {
  scholarship: Scholarship;
  className?: string;
}) {
  const codes = getCountryCodes(s);

  if (codes.length === 0) {
    return <GlobeIcon className="h-4 w-4 shrink-0" />;
  }

  return (
    <span className="flex shrink-0 items-center gap-1">
      {codes.map((code) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={code}
          src={`https://flagcdn.com/w40/${code}.png`}
          srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
          alt={`Flag ${code.toUpperCase()}`}
          title={code === "eu" ? "European Union" : code.toUpperCase()}
          loading="lazy"
          className={`${className} rounded-[3px] object-cover shadow-sm ring-1 ring-black/10`}
        />
      ))}
    </span>
  );
}
