import type { Metadata } from "next";
import ScholarshipExplorer from "@/components/ScholarshipExplorer";
import { getAllScholarships } from "@/lib/scholarships";

export const metadata: Metadata = {
  title: "Browse Scholarships",
  description: "Search and filter scholarships by level, region and funding type.",
};

export default function ScholarshipsPage() {
  const scholarships = getAllScholarships();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">All Scholarships</h1>
      <p className="mt-2 mb-8 text-slate-600">
        Search by keyword and narrow results with the filters below.
      </p>
      <ScholarshipExplorer scholarships={scholarships} />
    </div>
  );
}
