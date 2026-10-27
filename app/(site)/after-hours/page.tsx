import type { Metadata } from "next";
import { Carousel } from "@/components/Carousel";
import { GameLibrary } from "@/components/GameLibrary";
import { GameSlide } from "@/components/GameSlide";
import { ExploreCards } from "@/components/ExploreCards";
import { WatchSlide } from "@/components/WatchSlide";
import { PageIntro, Placeholder, ProgressBar, SectionHeading } from "@/components/primitives";
import { books, games, music } from "@/lib/content";
import { getGames } from "@/lib/steam";
import { getWatchLists } from "@/lib/simkl";
import { getTopTrack } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "After hours: Life outside code",
  description: "Shows, music, games and books: what I'm into when the laptop closes.",
};

export const revalidate = 3600;

export default async function AfterHoursPage() {
  const [lists, track, gameLists] = await Promise.all([getWatchLists(), getTopTrack(), getGames()]);
  // Spotify fills the track details; the note and links stay from Keystatic.
  const nowPlaying = track
    ? { ...music, title: track.title, artist: track.artist, cover: track.cover ?? music.cover, listenHref: track.href }
    : music;
  const watch = [
    { id: "watching", eyebrow: "Watching now", title: "Currently watching.", items: lists.watching },
    { id: "finished", eyebrow: "Recently finished", title: "Just wrapped up.", items: lists.completed },
    { id: "up-next", eyebrow: "Up next", title: "On the watchlist.", items: lists.planned },
  ];
  const gaming = [
    { id: "playing-now", eyebrow: "Playing now", title: "On the screen lately.", items: gameLists.playing },
    { id: "recently-played", eyebrow: "Recently played", title: "Back on the shelf.", items: gameLists.recent },
  ];
  const steamHasGames = gaming.some((g) => g.items.length > 0);
  const gamesSource = steamHasGames ? "steam" : games.length > 0 ? "keystatic" : "none";
  const readPct = Math.round((books.current.page / books.current.pages) * 100);

  return (
    <main>
      <PageIntro
        eyebrow="After hours"
        eyebrowRight="Last updated [October 2026]"
        title={
          <>
            After
            <br />
            hours
          </>
        }
        intro="The shows, music, games and books I'm into when the laptop closes."
      />

      <div className="container-x pb-20 sm:pb-30">
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
            {nowPlaying.cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote Spotify artwork, already sized
              <img
                src={nowPlaying.cover}
                alt={`${nowPlaying.title} cover`}
                loading="lazy"
                className="aspect-square w-[260px] max-w-full shrink-0 border border-[rgba(128,128,128,0.35)] object-cover"
              />
            ) : (
              <div className="stripes-invert meta grid aspect-square w-[260px] max-w-full shrink-0 place-items-center border border-[rgba(128,128,128,0.35)] opacity-80">
                [Album cover]
              </div>
            )}
            <div className="flex flex-[1_1_320px] flex-col gap-3">
              <span className="meta text-[13px] opacity-75">On repeat lately</span>
              <span className="font-display text-[clamp(32px,3.6vw,52px)] leading-none font-extrabold tracking-[-0.035em]">
                {nowPlaying.title}
              </span>
              <span className="text-lg opacity-80">{nowPlaying.artist}</span>
              {nowPlaying.note && <p className="mt-1 max-w-[520px] text-pretty opacity-85">{nowPlaying.note}</p>}
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={nowPlaying.listenHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-13 items-center bg-accent px-6 font-semibold text-on-accent no-underline hover:text-on-accent"
                >
                  {nowPlaying.listenLabel} ↗
                </a>
                <a
                  href={nowPlaying.playlistsHref}
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

        {/* Games (live from Steam; falls back to the Keystatic list when Steam has nothing).
            data-games-source / data-games-status show in DevTools; the badge only renders in `next dev`. */}
        <div className="contents" data-games-source={gamesSource} data-games-status={gameLists.status}>
          {process.env.NODE_ENV === "development" && (
            <p className="meta mt-16 text-[11px] text-muted-foreground sm:mt-24">
              [dev] Games source: {gamesSource} ({gameLists.status})
            </p>
          )}
          {!steamHasGames && games.length > 0 && <GameLibrary games={games} />}
          {gaming.map(
            (g) =>
              g.items.length > 0 && (
                <Carousel key={g.id} id={g.id} eyebrow={g.eyebrow} title={g.title}>
                  {g.items.map((item) => (
                    <GameSlide key={item.appid} item={item} />
                  ))}
                </Carousel>
              ),
          )}
        </div>
      </div>

      <ExploreCards items={["work", "about"]} />
    </main>
  );
}
