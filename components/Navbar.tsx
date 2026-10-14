import Link from "next/link";
import { CapIcon } from "./Icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white">
            <CapIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-900">
            Scholarship<span className="text-brand-500">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link href="/" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-brand-800 sm:block">
            Home
          </Link>
          <Link href="/scholarships?level=Master" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-brand-800 md:block">
            Master
          </Link>
          <Link href="/scholarships?level=PhD" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-brand-800 md:block">
            PhD
          </Link>
          <Link href="/scholarships" className="ml-2 rounded-lg bg-brand-700 px-4 py-2 text-white shadow-sm hover:bg-brand-800">
            Browse all
          </Link>
        </div>
      </nav>
    </header>
  );
}
