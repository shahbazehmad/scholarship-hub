import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold text-brand-800">
          Scholarship<span className="text-brand-500">Hub</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          <Link href="/" className="text-slate-600 hover:text-brand-700">
            Home
          </Link>
          <Link
            href="/scholarships"
            className="rounded-lg bg-brand-700 px-3 py-2 text-white hover:bg-brand-800"
          >
            Browse
          </Link>
        </div>
      </nav>
    </header>
  );
}
