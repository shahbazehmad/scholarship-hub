import type { ReactNode } from "react";

const styles = {
  funding: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  partial: "bg-amber-50 text-amber-800 ring-amber-600/20",
  deadline: "bg-slate-100 text-slate-700 ring-slate-500/20",
  level: "bg-brand-50 text-brand-700 ring-brand-600/20",
  type: "bg-violet-50 text-violet-700 ring-violet-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
} as const;

export type BadgeVariant = keyof typeof styles;

export default function Badge({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
