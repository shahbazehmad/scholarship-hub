// Shared artwork for generated PNG icons (Apple touch icon and PWA manifest icons).
export function BrandIcon({ size }: { size: number }) {
  const cap = Math.round(size * 0.54);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb 0%, #172554 100%)",
      }}
    >
      <svg
        width={cap}
        height={cap}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </svg>
    </div>
  );
}
