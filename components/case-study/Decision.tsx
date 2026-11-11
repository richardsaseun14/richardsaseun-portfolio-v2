import type { ReactNode } from "react";
export function ProblemList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-line border-y border-line">{children}</ul>;
}
export function Problem({ n, decision, children }: { n: string; decision: string; children: ReactNode }) {
  return (
    <li className="grid gap-3 py-6 sm:grid-cols-[40px_1fr]">
      <span className="meta text-accent">P{n}</span>
      <div>
        {children}
        <a className="mt-3 block text-sm underline underline-offset-4" href={`#decision-${decision}`}>
          See decision {decision} →
        </a>
      </div>
    </li>
  );
}
export function Decision({
  n,
  title,
  problem,
  instead,
  tradeoff,
  proof,
}: {
  n: string;
  title: string;
  problem: string;
  instead: string;
  tradeoff: string;
  proof: string;
}) {
  return (
    <aside id={`decision-${n}`} className="scroll-mt-28 border border-l-2 border-line border-l-accent p-6 sm:p-8">
      <p className="meta text-accent">
        Decision {n} · {problem}
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
      <dl className="mt-6 space-y-5">
        {[
          ["Instead of", instead],
          ["Trade-off", tradeoff],
          ["Proof", proof],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="meta text-muted-foreground">{label}</dt>
            <dd className="mt-2">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
