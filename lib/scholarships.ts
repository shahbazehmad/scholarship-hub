import data from "@/data/scholarships.json";

export type FundingType = "Fully Funded" | "Partial";
export type OpportunityType = "Scholarship" | "Grant" | "Fellowship";

export interface Scholarship {
  slug: string;
  name: string;
  organization: string;
  country: string;
  region: string;
  type: OpportunityType;
  levels: string[];
  fundingType: FundingType;
  funding: string;
  deadline: string | null;
  deadlineNote: string;
  eligibility: string;
  addedAt: string;
  featured: boolean;
  tags: string[];
  description: string;
  officialUrl: string;
  autoAdded?: boolean;
  source?: string;
  sourceUrl?: string;
}

const all = data as unknown as Scholarship[];

/** Listings whose deadline has passed are hidden at build/revalidation time. */
function active(): Scholarship[] {
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((s) => !s.deadline || s.deadline >= today);
}

export function getAllScholarships(): Scholarship[] {
  return active();
}

export function getScholarshipBySlug(slug: string): Scholarship | undefined {
  return active().find((s) => s.slug === slug);
}

export function getFeaturedScholarships(limit = 6): Scholarship[] {
  return active()
    .filter((s) => s.featured)
    .slice(0, limit);
}

export function getRecentScholarships(limit = 6): Scholarship[] {
  return [...active()]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export function getClosingSoon(limit = 3): Scholarship[] {
  return active()
    .filter((s) => s.deadline)
    .sort((a, b) => (a.deadline as string).localeCompare(b.deadline as string))
    .slice(0, limit);
}

export function getRelated(s: Scholarship, limit = 3): Scholarship[] {
  return active()
    .filter((o) => o.slug !== s.slug)
    .map((o) => ({
      o,
      score:
        (o.region === s.region ? 2 : 0) +
        o.levels.filter((l) => s.levels.includes(l)).length +
        (o.type === s.type ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.o);
}

export function getStats() {
  const list = active();
  return {
    total: list.length,
    countries: new Set(list.map((s) => s.country)).size,
    fullyFunded: list.filter((s) => s.fundingType === "Fully Funded").length,
    regions: new Set(list.map((s) => s.region)).size,
  };
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function deadlineLabel(s: Scholarship): string {
  return s.deadline ? formatDate(s.deadline) : "Check official site";
}

/** Whole days until the deadline, or null when there is no fixed date. */
export function daysLeft(s: Scholarship): number | null {
  if (!s.deadline) return null;
  const end = Date.parse(s.deadline + "T23:59:59Z");
  return Math.max(0, Math.ceil((end - Date.now()) / 86400000));
}

export const REGION_STYLES: Record<string, string> = {
  Europe: "bg-blue-100 text-blue-800",
  "North America": "bg-indigo-100 text-indigo-800",
  Asia: "bg-rose-100 text-rose-800",
  Africa: "bg-amber-100 text-amber-800",
  Oceania: "bg-teal-100 text-teal-800",
  "Middle East": "bg-orange-100 text-orange-800",
  "Latin America": "bg-emerald-100 text-emerald-800",
  Global: "bg-slate-200 text-slate-800",
};
