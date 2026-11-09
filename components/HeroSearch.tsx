"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, SearchIcon } from "./Icons";

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/scholarships?q=${encodeURIComponent(query)}` : "/scholarships");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-3xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-slate-900/5 sm:flex-row sm:items-center sm:p-2.5"
    >
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-600" />
        <label htmlFor="hero-q" className="sr-only">Search scholarships</label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try 'Germany', 'PhD', 'engineering'..."
          className="w-full rounded-2xl border-0 py-4 pl-14 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-800 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:from-brand-600 hover:to-brand-900 sm:py-3.5"
      >
        Search <ChevronRightIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
