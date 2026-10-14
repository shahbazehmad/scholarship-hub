"use client";

import { useMemo, useState } from "react";
import ScholarshipCard from "./ScholarshipCard";
import SearchFilterBar, { type Filters } from "./SearchFilterBar";
import type { Scholarship } from "@/lib/scholarships";

export default function ScholarshipExplorer({
  scholarships,
}: {
  scholarships: Scholarship[];
}) {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    level: "",
    region: "",
    funding: "",
  });

  const levels = useMemo(
    () => Array.from(new Set(scholarships.flatMap((s) => s.levels))).sort(),
    [scholarships]
  );
  const regions = useMemo(
    () =>
      Array.from(
        new Set(scholarships.flatMap((s) => [s.region, s.country]))
      ).sort(),
    [scholarships]
  );
  const fundingTypes = useMemo(
    () => Array.from(new Set(scholarships.map((s) => s.fundingType))),
    [scholarships]
  );

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return scholarships.filter((s) => {
      if (filters.level && !s.levels.includes(filters.level)) return false;
      if (
        filters.region &&
        s.region !== filters.region &&
        s.country !== filters.region
      )
        return false;
      if (filters.funding && s.fundingType !== filters.funding) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.organization,
        s.country,
        s.description,
        s.funding,
        ...s.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [scholarships, filters]);

  return (
    <div className="space-y-6">
      <SearchFilterBar
        filters={filters}
        onChange={setFilters}
        levels={levels}
        regions={regions}
        fundingTypes={fundingTypes}
      />
      <p className="text-sm text-slate-500">
        {results.length} scholarship{results.length === 1 ? "" : "s"} found
      </p>
      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No scholarships match your filters. Try broadening your search.
        </div>
      )}
    </div>
  );
}
