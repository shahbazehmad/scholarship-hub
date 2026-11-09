export default function Logo({ className = "h-10 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="logoTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="logoBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e40af" />
          <stop offset="1" stopColor="#172554" />
        </linearGradient>
      </defs>
      <path d="M12 22v12c0 5 32 5 32 0V22L28 29 12 22Z" fill="url(#logoBase)" />
      <path d="M28 5 54 17 28 29 2 17 28 5Z" fill="url(#logoTop)" />
      <path d="M28 5 54 17 28 29" fill="none" stroke="#93c5fd" strokeWidth="1" opacity=".5" />
      <path d="M50 19v18" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="47.5" y="36" width="5" height="8" rx="2" fill="#1e3a8a" />
    </svg>
  );
}
