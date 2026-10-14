import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-900 text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-bold text-white">ScholarshipHub</p>
          <p className="mt-2 max-w-xs text-sm text-blue-200">
            A curated directory of scholarships, grants and fellowships from
            around the world.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Browse</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/scholarships?level=Bachelor">Bachelor</Link></li>
            <li><Link className="hover:text-white" href="/scholarships?level=Master">Master</Link></li>
            <li><Link className="hover:text-white" href="/scholarships?level=PhD">PhD</Link></li>
            <li><Link className="hover:text-white" href="/scholarships?type=Grant">Grants</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Disclaimer</p>
          <p className="mt-3 text-sm text-blue-200">
            Information is summarised from public sources and may change. Always
            confirm deadlines, eligibility and funding on the official website
            before applying.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-blue-300">
        &copy; {new Date().getFullYear()} Scholarship Hub. Not affiliated with any listed provider.
      </div>
    </footer>
  );
}
