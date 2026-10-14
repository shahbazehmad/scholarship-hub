import type { Metadata } from "next";
import { Suspense } from "react";
import ScholarshipExplorer from "@/components/ScholarshipExplorer";
import { getAllScholarships } from "@/lib/scholarships";

export const metadata: Metadata = {
  title: "Browse Scholarships",
  description:
    "Search and filter scholarships, grants and fellowships by level, region, country and funding type.",
};

export default function ScholarshipsPage() {
  const scholarships = getAllScholarships();

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            All Scholarships, Grants and Fellowships
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Search by keyword and narrow results by opportunity type, level, region, country and funding.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<p className="text-slate-500">Loading...</p>}>
          <ScholarshipExplorer scholarships={scholarships} />
        </Suspense>
      </div>
    </>
  );
}
