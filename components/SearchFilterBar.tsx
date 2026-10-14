import { SearchIcon } from "./Icons";

export interface Filters {
  query: string;
  type: string;
  level: string;
  region: string;
  country: string;
  funding: string;
}

export const EMPTY_FILTERS: Filters = {
  query: "",
  type: "",
  level: "",
  region: "",
  country: "",
  funding: "",
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  types: string[];
  levels: string[];
  regions: string[];
  countries: string[];
  fundingTypes: string[];
}

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

function Select({
  id,
  label,
  value,
  onChange,
  options,
  all,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  all: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export default function SearchFilterBar({
  filters,
  onChange,
  types,
  levels,
  regions,
  countries,
  fundingTypes,
}: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const active = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="q" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Search
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="q"
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Keyword, university, country..."
            className={`${selectClass} pl-9`}
          />
        </div>
      </div>
      <Select id="type" label="Opportunity" value={filters.type} onChange={(v) => set({ type: v })} options={types} all="All types" />
      <Select id="level" label="Category" value={filters.level} onChange={(v) => set({ level: v })} options={levels} all="All levels" />
      <Select id="region" label="Region" value={filters.region} onChange={(v) => set({ region: v })} options={regions} all="All regions" />
      <Select id="country" label="Country" value={filters.country} onChange={(v) => set({ country: v })} options={countries} all="All countries" />
      <Select id="funding" label="Funding type" value={filters.funding} onChange={(v) => set({ funding: v })} options={fundingTypes} all="All funding" />
      {active && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
