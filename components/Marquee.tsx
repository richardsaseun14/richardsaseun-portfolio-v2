import { marquee } from "@/lib/content";
import { Asterisk } from "./Icons";

export function Marquee() {
  return (
    <div
      className="marquee overflow-hidden border-b-2 border-black bg-accent text-on-accent"
      role="marquee"
      aria-label="What I do"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex h-10 shrink-0 items-center gap-9 pr-9 font-mono text-[13px] font-medium uppercase tracking-[0.08em] whitespace-nowrap"
          >
            {marquee.map((word) => (
              <span key={word} className="flex items-center gap-9">
                <span>{word}</span>
                <Asterisk />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
