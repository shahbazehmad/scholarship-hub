"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./Icons";

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/scholarships?q=${encodeURIComponent(query)}` : "/scholarships");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-2 shadow-xl sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <label htmlFor="hero-q" className="sr-only">Search scholarships</label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try 'Germany', 'PhD', 'engineering'..."
          className="w-full rounded-xl border-0 py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <button type="submit" className="rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800">
        Search
      </button>
    </form>
  );
}
