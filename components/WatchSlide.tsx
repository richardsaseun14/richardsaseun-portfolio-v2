import { Slide } from "./Carousel";
import { Placeholder, ProgressBar } from "./primitives";
import type { WatchItem } from "@/lib/simkl";

/** One poster card in a Simkl watch-list carousel. */
export function WatchSlide({ item }: { item: WatchItem }) {
  return (
    <Slide>
      <a href={item.href} target="_blank" rel="noreferrer" className="block no-underline">
        {item.poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote Simkl posters, already sized
          <img
            src={item.poster}
            alt={`${item.title} poster`}
            loading="lazy"
            className="aspect-[2/3] w-full border border-line object-cover"
          />
        ) : (
          <Placeholder label="[Poster]" className="aspect-[2/3]" />
        )}
      </a>
      <div className="flex flex-col gap-1.5">
        <a href={item.href} target="_blank" rel="noreferrer" className="text-lg font-semibold text-ink no-underline">
          {item.title}
        </a>
        <span className="meta text-muted-foreground">{item.meta}</span>
        {item.progress !== undefined && <ProgressBar value={item.progress} />}
        <span className="meta mt-1 self-start border border-line px-2 py-1 text-[11px] tracking-[0.06em] text-muted-foreground">
          {item.kind}
        </span>
      </div>
    </Slide>
  );
}
