import type { Metadata } from "next";
import { Carousel } from "@/components/Carousel";
import { GameLibrary } from "@/components/GameLibrary";
import { ExploreCards } from "@/components/ExploreCards";
import { WatchSlide } from "@/components/WatchSlide";
import { PageIntro, Placeholder, ProgressBar, SectionHeading } from "@/components/primitives";
import { books, games, learning, music, roots } from "@/lib/content";
import { getWatchLists } from "@/lib/simkl";

export const metadata: Metadata = {
  title: "Side quests: Life outside code",
  description: "Movies, shows, anime, music and books: the person behind the code.",
};

export const revalidate = 3600;

function RootIcon({ kind }: { kind: (typeof roots)[number]["key"] }) {
  if (kind === "roots") {
    return (
      <svg role="img" aria-label="Flag of Nigeria" width="112" height="56" viewBox="0 0 6 3" className="block border border-line">
        <rect x="0" y="0" width="2" height="3" fill="#008751" />
        <rect x="2" y="0" width="2" height="3" fill="#FFFFFF" />
        <rect x="4" y="0" width="2" height="3" fill="#008751" />
      </svg>
    );
  }
  if (kind === "faith") {
    return (
      <svg aria-hidden width="44" height="56" viewBox="0 0 22 28" fill="none" stroke="var(--accent)" strokeWidth="2.2">
        <path d="M11 1v26M3 9h16" />
      </svg>
    );
  }
  return (
    <svg aria-hidden width="72" height="44" viewBox="0 0 36 22" fill="none" stroke="var(--accent)" strokeWidth="2">
      <circle cx="12" cy="11" r="9" />
      <circle cx="24" cy="11" r="9" />
    </svg>
  );
}

export default async function SideQuestsPage() {
  const lists = await getWatchLists();
  const watch = [
    { id: "watching", eyebrow: "Watching now", title: "Currently watching.", items: lists.watching },
    { id: "finished", eyebrow: "Recently finished", title: "Just wrapped up.", items: lists.completed },
    { id: "up-next", eyebrow: "Up next", title: "On the watchlist.", items: lists.planned },
  ];
  const readPct = Math.round((books.current.page / books.current.pages) * 100);

  return (
    <main>
      <PageIntro
        eyebrow="Side quests"
        eyebrowRight="Last updated [October 2026]"
        title={
          <>
            Side
            <br />
            quests
          </>
        }
        intro="Life outside the codebase. The shows, music, games and books I'm into, what I'm learning, and a little about who I am."
      />

      <div className="container-x pb-20 sm:pb-30">
        {/* Beyond the screen */}
        <section aria-labelledby="roots" className="mt-16 sm:mt-24">
          <SectionHeading id="roots" eyebrow="Beyond the screen" title="The person behind the code." />
          <div className="grid border-t border-l border-t-ink border-l-line [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {roots.map((r) => (
              <div key={r.key} className="flex min-h-[260px] flex-col gap-3.5 border-r border-b border-line p-6 sm:min-h-[300px] sm:p-7">
                <div className="flex h-16 items-center">
                  <RootIcon kind={r.key} />
                </div>
                <span className="meta mt-auto text-muted-foreground">{r.label}</span>
                <span className="font-display text-[clamp(26px,2.6vw,36px)] leading-[1.05] font-extrabold tracking-[-0.03em]">
                  {r.title}
                </span>
                <p className="text-pretty text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Watching (live from Simkl) */}
        {watch.map(
          (w) =>
            w.items.length > 0 && (
              <Carousel key={w.id} id={w.id} eyebrow={w.eyebrow} title={w.title}>
                {w.items.map((item) => (
                  <WatchSlide key={item.href} item={item} />
                ))}
              </Carousel>
            ),
        )}

        {/* Music */}
        <section aria-labelledby="music" className="mt-16 sm:mt-24">
          <SectionHeading id="music" eyebrow="Music" title="Giving me joy right now." />
          <div className="flex flex-wrap items-center gap-x-12 gap-y-8 bg-invert p-[clamp(24px,4vw,48px)] text-invert-ink">
            <div className="stripes-invert meta grid aspect-square w-[260px] max-w-full shrink-0 place-items-center border border-[rgba(128,128,128,0.35)] opacity-80">
              [Album cover]
            </div>
            <div className="flex flex-[1_1_320px] flex-col gap-3">
              <span className="meta text-[13px] opacity-75">On repeat lately</span>
              <span className="font-display text-[clamp(32px,3.6vw,52px)] leading-none font-extrabold tracking-[-0.035em]">
                {music.title}
              </span>
              <span className="text-lg opacity-80">{music.artist}</span>
              <p className="mt-1 max-w-[520px] text-pretty opacity-85">{music.note}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={music.listenHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-13 items-center bg-accent px-6 font-semibold text-on-accent no-underline hover:text-on-accent"
                >
                  {music.listenLabel} ↗
                </a>
                <a
                  href={music.playlistsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-13 items-center border border-[rgba(128,128,128,0.5)] px-6 font-medium no-underline hover:border-current hover:text-[inherit]"
                >
                  My playlists ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Books */}
        <section aria-labelledby="reading" className="mt-16 sm:mt-24">
          <SectionHeading id="reading" eyebrow="Books" title="On the nightstand." />
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr))]">
            <div className="flex flex-wrap gap-7 border border-line bg-surface p-6 sm:p-8">
              <Placeholder label="[Cover]" className="aspect-[2/3] w-40 shrink-0" />
              <div className="flex flex-[1_1_220px] flex-col gap-2.5">
                <span className="meta self-start bg-accent px-2 py-1 text-[11px] tracking-[0.06em] text-on-accent">
                  Currently reading
                </span>
                <span className="font-display text-[clamp(26px,7vw,34px)] leading-[1.02] font-extrabold tracking-[-0.03em]">
                  {books.current.title}
                </span>
                <span className="text-muted-foreground">{books.current.author}</span>
                <p className="mt-1.5 text-pretty">{books.current.note}</p>
                <div className="mt-auto flex flex-col gap-2 pt-3">
                  <span className="meta text-muted-foreground">
                    Page {books.current.page} of {books.current.pages}
                  </span>
                  <ProgressBar value={readPct} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 border border-line p-6 sm:p-8">
              <h3 className="eyebrow font-medium">Recently finished</h3>
              <ul className="border-t border-ink">
                {books.finished.map((b, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-x-5 gap-y-0.5 border-b border-line py-4 hover:bg-surface">
                    <span className="min-w-[60%] flex-1 font-semibold">{b.title}</span>
                    <span className="text-muted-foreground">{b.author}</span>
                  </li>
                ))}
              </ul>
              <a href={books.listHref} className="meta inline-flex min-h-11 items-center text-[13px]">
                Full reading list ↗
              </a>
            </div>
          </div>
        </section>

        {/* Games */}
        <GameLibrary games={games} />

        {/* Learning */}
        <section aria-labelledby="learning" className="mt-16 sm:mt-24">
          <div className="flex flex-wrap gap-x-16 gap-y-10 bg-invert p-[clamp(28px,5vw,64px)] text-invert-ink">
            <div className="flex min-w-0 flex-[999_1_min(320px,100%)] flex-col gap-5">
              <span className="meta text-[13px] opacity-75">Currently learning</span>
              <h2 id="learning" className="font-display text-[clamp(34px,5.6vw,88px)] leading-[0.9] font-black tracking-[-0.045em] uppercase">
                AI
                <br />
                engineering<span className="text-accent">.</span>
              </h2>
              <p className="max-w-[520px] text-[17px] leading-normal sm:text-[19px] text-pretty opacity-85">{learning.body}</p>
            </div>
            <dl className="flex min-w-0 flex-[1_1_min(300px,100%)] flex-col self-end text-[15px]">
              {learning.facts.map((f, i, arr) => (
                <div
                  key={f.label}
                  className={`flex justify-between gap-4 border-t border-[rgba(128,128,128,0.35)] py-4 ${
                    i === arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <dt className="opacity-70">{f.label}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <ExploreCards items={["work", "about"]} />
    </main>
  );
}
