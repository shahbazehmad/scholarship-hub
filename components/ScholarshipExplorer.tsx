"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ScholarshipCard from "./ScholarshipCard";
import SearchFilterBar, { EMPTY_FILTERS, type Filters } from "./SearchFilterBar";
import { GridIcon, ListIcon } from "./Icons";
import type { Scholarship } from "@/lib/scholarships";

const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();

export default function ScholarshipExplorer({
  scholarships,
}: {
  scholarships: Scholarship[];
}) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    query: params.get("q") ?? EMPTY_FILTERS.query,
    type: params.get("type") ?? "",
    level: params.get("level") ?? "",
    region: params.get("region") ?? "",
    country: params.get("country") ?? "",
    funding: params.get("funding") ?? "",
  });
  const [sort, setSort] = useState<"newest" | "name">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const types = useMemo(() => uniq(scholarships.map((s) => s.type)), [scholarships]);
  const levels = useMemo(() => uniq(scholarships.flatMap((s) => s.levels)), [scholarships]);
  const regions = useMemo(() => uniq(scholarships.map((s) => s.region)), [scholarships]);
  const countries = useMemo(() => uniq(scholarships.map((s) => s.country)), [scholarships]);
  const fundingTypes = useMemo(() => uniq(scholarships.map((s) => s.fundingType)), [scholarships]);

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = scholarships.filter((s) => {
      if (filters.type && s.type !== filters.type) return false;
      if (filters.level && !s.levels.includes(filters.level)) return false;
      if (filters.region && s.region !== filters.region) return false;
      if (filters.country && s.country !== filters.country) return false;
      if (filters.funding && s.fundingType !== filters.funding) return false;
      if (!q) return true;
      const haystack = [
        s.name,
        s.organization,
        s.country,
        s.region,
        s.description,
        s.funding,
        s.eligibility,
        ...s.tags,
      ]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
    return list.sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : b.addedAt.localeCompare(a.addedAt)
    );
  }, [scholarships, filters, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <SearchFilterBar
          filters={filters}
          onChange={setFilters}
          types={types}
          levels={levels}
          regions={regions}
          countries={countries}
          fundingTypes={fundingTypes}
        />
      </aside>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{results.length}</span>{" "}
            result{results.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "name")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="name">Name A-Z</option>
            </select>
            <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className={view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4"}>
            {results.map((s) => (
              <div key={s.slug} className="relative">
                <ScholarshipCard scholarship={s} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold text-slate-900">No matches found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different keyword or clear some filters.
            </p>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-4 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
