import type { ReactNode } from "react";

export function Chapter({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter
      aria-labelledby={`${id}-title`}
      className="cs-chapter"
    >
      <p className="meta text-accent">Chapter {number}</p>
      <h2
        id={`${id}-title`}
        className="mt-4 font-display text-[clamp(26px,3.2vw,42px)] leading-tight font-extrabold tracking-[-0.03em]"
      >
        {title}
      </h2>
      <div className="cs-prose mt-8">{children}</div>
    </section>
  );
}
