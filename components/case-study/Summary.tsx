export function Summary({
  project,
  problem,
  work,
  part,
  result,
}: {
  project: string;
  problem: string;
  work: string;
  part?: string;
  result: string;
}) {
  return (
    <section aria-labelledby="summary-title" className="border-y border-line py-10">
      <h2 id="summary-title" className="font-display text-3xl font-extrabold">
        In short<span className="text-accent">.</span>
      </h2>
      <dl className="mt-8 grid gap-6">
        {[
          ["Project", project],
          ["Problem", problem],
          ["What I did", work],
          ["My part", part],
          ["Result", result],
        ]
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="grid gap-2 sm:grid-cols-[130px_1fr]">
              <dt className="meta text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}
