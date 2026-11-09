/** Decorative SVG illustrations for the home page. All are purely visual. */

export function CapIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="capTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#0b1f55" />
        </linearGradient>
        <linearGradient id="scroll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe7ff" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="182" rx="120" ry="10" fill="#000" opacity=".18" />
      <path d="M72 84v38c0 18 136 18 136 0V84l-68 26-68-26Z" fill="#061a47" />
      <path d="M140 22 262 66 140 110 18 66 140 22Z" fill="url(#capTop)" />
      <path d="M140 22 262 66 140 110" fill="none" stroke="#3b6fd8" strokeWidth="2" opacity=".7" />
      <circle cx="140" cy="66" r="5" fill="#3b6fd8" />
      <path d="M140 66 44 78v52" fill="none" stroke="#0b1f55" strokeWidth="4" strokeLinecap="round" />
      <rect x="39" y="128" width="10" height="26" rx="4" fill="#0b1f55" />
      <g transform="rotate(-14 190 150)">
        <rect x="110" y="134" width="170" height="36" rx="18" fill="url(#scroll)" />
        <rect x="196" y="134" width="20" height="36" fill="#2563eb" />
        <circle cx="128" cy="152" r="18" fill="#eef4ff" />
        <circle cx="128" cy="152" r="11" fill="#fbbf24" />
        <circle cx="128" cy="152" r="6" fill="#f59e0b" />
      </g>
    </svg>
  );
}

export function GlobeLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="200" cy="200" r="190" />
      <ellipse cx="200" cy="200" rx="95" ry="190" />
      <ellipse cx="200" cy="200" rx="150" ry="190" />
      <path d="M10 200h380M40 110h320M40 290h320M80 50h240M80 350h240" />
    </svg>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 200" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93c5fd" stopOpacity=".95" />
          <stop offset="1" stopColor="#bfdbfe" stopOpacity=".6" />
        </linearGradient>
      </defs>
      <g fill="url(#sky)">
        <rect x="20" y="110" width="34" height="90" />
        <rect x="58" y="88" width="30" height="112" />
        <circle cx="73" cy="84" r="10" />
        <rect x="92" y="120" width="40" height="80" />
        <rect x="136" y="100" width="28" height="100" />
        <path d="M205 200 226 100 236 52 246 8 256 52 266 100 287 200 272 200 256 135 240 135 220 200Z" />
        <rect x="216" y="98" width="60" height="7" />
        <rect x="230" y="56" width="32" height="5" />
        <rect x="330" y="92" width="30" height="108" />
        <rect x="380" y="60" width="34" height="140" />
        <path d="M380 60 397 14 414 60Z" />
        <rect x="432" y="100" width="170" height="100" rx="6" />
        <rect x="620" y="96" width="30" height="104" />
        <rect x="654" y="72" width="28" height="128" />
        <path d="M654 72 668 36 682 72Z" />
        <rect x="690" y="108" width="40" height="92" />
        <rect x="738" y="84" width="30" height="116" />
        <circle cx="753" cy="80" r="10" />
        <rect x="776" y="118" width="46" height="82" />
        <rect x="830" y="96" width="36" height="104" />
      </g>
      <circle cx="397" cy="84" r="9" fill="#eff6ff" />
      <g fill="#dbeafe" opacity=".9">
        <rect x="446" y="116" width="14" height="26" rx="7" />
        <rect x="472" y="116" width="14" height="26" rx="7" />
        <rect x="498" y="116" width="14" height="26" rx="7" />
        <rect x="524" y="116" width="14" height="26" rx="7" />
        <rect x="550" y="116" width="14" height="26" rx="7" />
        <rect x="576" y="116" width="14" height="26" rx="7" />
        <rect x="446" y="154" width="14" height="30" rx="7" />
        <rect x="472" y="154" width="14" height="30" rx="7" />
        <rect x="498" y="154" width="14" height="30" rx="7" />
        <rect x="524" y="154" width="14" height="30" rx="7" />
        <rect x="550" y="154" width="14" height="30" rx="7" />
        <rect x="576" y="154" width="14" height="30" rx="7" />
      </g>
      <path d="M0 176C120 150 240 196 380 172S640 150 760 176 860 170 900 160V200H0Z" fill="#2563eb" opacity=".85" />
      <path d="M0 188C140 166 260 200 400 184S660 168 780 188 870 184 900 178V200H0Z" fill="#1d4ed8" />
    </svg>
  );
}
