export function Timeline({
  items,
}: {
  items: { date: string; title: string; detail: string }[];
}) {
  return (
    <ol className="border-l border-line pl-6">
      {items.map((item) => (
        <li key={item.title} className="border-b border-line py-6 first:pt-0">
          <p className="meta text-accent">{item.date}</p>
          <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}
export function Lessons({
  items,
}: {
  items: { title: string; detail: string }[];
}) {
  return (
    <ol className="space-y-8">
      {items.map((item, i) => (
        <li key={item.title} className="grid grid-cols-[32px_1fr] gap-4">
          <span className="meta text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-muted-foreground">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function Credits({
  items,
}: {
  items: { role: string; name: string }[];
}) {
  return (
    <section
      aria-labelledby="credits-title"
      className="border-t border-line pt-10"
    >
      <h2 id="credits-title" className="font-display text-2xl font-extrabold">
        Credits
      </h2>
      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.role}>
            <dt className="meta text-muted-foreground">{item.role}</dt>
            <dd className="mt-2">{item.name}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
