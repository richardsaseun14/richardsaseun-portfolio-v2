import type { ReactNode } from "react";
export function Stats({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="Project at a glance"
      className="grid [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))] bg-invert text-invert-ink"
    >
      {children}
    </section>
  );
}
export function Stat({ value, label, source }: { value: string; label: string; source?: string }) {
  return (
    <div className="p-6 sm:p-9">
      <p className="font-display text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight">{value}</p>
      <p className="mt-3 meta">{label}</p>
      {source && <p className="mt-3 text-sm opacity-70">{source}</p>}
    </div>
  );
}
