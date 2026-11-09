"use client";

import { useState, type ReactNode } from "react";

// Professional emblem fallbacks. One is picked per scholarship from its name,
// so a listing always shows the same emblem (stable, no flicker on reload).
const EMBLEMS: { gradient: string; paths: ReactNode }[] = [
  {
    gradient: "from-blue-500 to-blue-800",
    paths: (
      <>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
  },
  {
    gradient: "from-indigo-500 to-indigo-800",
    paths: (
      <>
        <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" />
        <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" />
      </>
    ),
  },
  {
    gradient: "from-sky-500 to-blue-900",
    paths: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m15.5 13 1.5 9-5-3-5 3 1.5-9" />
      </>
    ),
  },
  {
    gradient: "from-cyan-600 to-blue-900",
    paths: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </>
    ),
  },
  {
    gradient: "from-blue-600 to-slate-800",
    paths: (
      <>
        <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2 3 7h18Z" />
      </>
    ),
  },
  {
    gradient: "from-violet-500 to-indigo-900",
    paths: (
      <>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6M10 22h4" />
      </>
    ),
  },
];

function pickEmblem(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return EMBLEMS[h % EMBLEMS.length];
}

export default function ScholarshipLogo({
  src,
  name,
  size = "h-12 w-12",
}: {
  src: string | null;
  name: string;
  size?: string;
  /** Kept for backwards compatibility; the emblem fallback replaces initials. */
  initials?: string;
  fallbackClass?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const emblem = pickEmblem(name);
    return (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${emblem.gradient} text-white shadow-sm ring-1 ring-black/5`}
        role="img"
        aria-label={`${name} emblem`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-1/2 w-1/2"
          aria-hidden
        >
          {emblem.paths}
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-1.5"
      />
    </div>
  );
}
