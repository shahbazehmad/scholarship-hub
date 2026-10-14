import data from "@/data/scholarships.json";

export type FundingType = "Fully Funded" | "Partial";

export interface Scholarship {
  slug: string;
  name: string;
  organization: string;
  country: string;
  region: string;
  levels: string[];
  fundingType: FundingType;
  funding: string;
  deadline: string;
  addedAt: string;
  featured: boolean;
  tags: string[];
  description: string;
  officialUrl: string;
}

const scholarships = data as Scholarship[];

export function getAllScholarships(): Scholarship[] {
  return scholarships;
}

export function getScholarshipBySlug(slug: string): Scholarship | undefined {
  return scholarships.find((s) => s.slug === slug);
}

export function getFeaturedScholarships(): Scholarship[] {
  return scholarships.filter((s) => s.featured);
}

export function getRecentScholarships(limit = 3): Scholarship[] {
  return [...scholarships]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
