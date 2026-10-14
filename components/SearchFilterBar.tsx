export interface Filters {
  query: string;
  level: string;
  region: string;
  funding: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  levels: string[];
  regions: string[];
  fundingTypes: string[];
}

const selectClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

export default function SearchFilterBar({
  filters,
  onChange,
  levels,
  regions,
  fundingTypes,
}: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="q" className="mb-1 block text-xs font-medium text-slate-500">
          Search
        </label>
        <input
          id="q"
          type="search"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Keyword, university, country..."
          className={selectClass}
        />
      </div>
      <div>
        <label htmlFor="level" className="mb-1 block text-xs font-medium text-slate-500">
          Category
        </label>
        <select
          id="level"
          value={filters.level}
          onChange={(e) => set({ level: e.target.value })}
          className={selectClass}
        >
          <option value="">All levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="region" className="mb-1 block text-xs font-medium text-slate-500">
          Region / Country
        </label>
        <select
          id="region"
          value={filters.region}
          onChange={(e) => set({ region: e.target.value })}
          className={selectClass}
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="funding" className="mb-1 block text-xs font-medium text-slate-500">
          Funding type
        </label>
        <select
          id="funding"
          value={filters.funding}
          onChange={(e) => set({ funding: e.target.value })}
          className={selectClass}
        >
          <option value="">All types</option>
          {fundingTypes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
