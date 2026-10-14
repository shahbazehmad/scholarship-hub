"use client";

import { useState } from "react";

export default function ScholarshipLogo({
  src,
  initials,
  fallbackClass,
  name,
  size = "h-12 w-12",
}: {
  src: string | null;
  initials: string;
  fallbackClass: string;
  name: string;
  size?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex ${size} shrink-0 items-center justify-center rounded-xl text-sm font-bold ${fallbackClass}`}
        aria-hidden
      >
        {initials}
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
