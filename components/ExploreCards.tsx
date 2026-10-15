import Link from "next/link";
import { explore } from "@/lib/content";
import { ArrowUpRight } from "./Icons";

type Key = keyof typeof explore;

export function ExploreCards({ items, labels }: { items: Key[]; labels?: Partial<Record<Key, string>> }) {
  return (
    <section aria-labelledby="explore-title" className="container-x pb-30">
      <h2 id="explore-title" className="eyebrow mb-6 font-medium">Keep exploring</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] border-t border-l border-t-ink border-l-line">
        {items.map((key) => {
          const item = explore[key];
          return (
            <Link
              key={key}
              href={item.href}
              className="group flex min-h-[200px] flex-col justify-between gap-12 border-r border-b border-line p-7 text-ink no-underline transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
            >
              <span className="meta opacity-75">{labels?.[key] ?? item.label}</span>
              <span className="flex items-end justify-between gap-4">
                <span className="min-w-0 font-display text-[clamp(32px,3.4vw,52px)] leading-[0.95] font-black tracking-[-0.035em] uppercase [overflow-wrap:anywhere]">
                  {item.title}
                </span>
                <ArrowUpRight size={32} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
