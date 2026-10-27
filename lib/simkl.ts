import "server-only";
import { unstable_cache } from "next/cache";

/*
 * Live watch lists from Simkl (https://api.simkl.org/guides/sync). Server-only: reads the API token.
 * Follows Simkl's sync model: a cheap /sync/activities check gates one /sync/all-items call,
 * so the library is only refetched when something changed (or daily, since episode counts
 * refresh without bumping activities).
 */

const API = "https://api.simkl.com";
const APP_NAME = "richardsaseun-portfolio";
const APP_VERSION = "1.0";
const ACTIVITIES_REVALIDATE = 3600;
const LIBRARY_REVALIDATE = 86400;
const LIMIT = 12;

type Kind = "Movie" | "Series" | "Anime";
type ListType = "shows" | "anime" | "movies";
type Status = "watching" | "completed" | "plantowatch";

export type WatchItem = {
  title: string;
  kind: Kind;
  meta: string;
  progress?: number;
  poster?: string;
  href: string;
};

export type WatchLists = { watching: WatchItem[]; completed: WatchItem[]; planned: WatchItem[] };

type RawMedia = { title: string; year?: number; poster?: string; ids: { simkl: number; slug?: string } };

type RawItem = {
  show?: RawMedia;
  movie?: RawMedia;
  status?: string;
  last_watched_at?: string;
  added_to_watchlist_at?: string;
  watched_episodes_count?: number;
  total_episodes_count?: number;
};

type Library = Partial<Record<ListType, RawItem[]>>;

const TYPES: ListType[] = ["shows", "anime", "movies"];
const KIND: Record<ListType, Kind> = { shows: "Series", anime: "Anime", movies: "Movie" };
const URL_SEGMENT: Record<ListType, string> = { shows: "tv", anime: "anime", movies: "movies" };

const EMPTY: WatchLists = { watching: [], completed: [], planned: [] };

export function toWatchItem(raw: RawItem, type: ListType, status: Status): WatchItem | null {
  const media = raw.show ?? raw.movie;
  if (!media) return null;

  const watched = raw.watched_episodes_count ?? 0;
  const total = raw.total_episodes_count ?? 0;
  const inProgress = status === "watching" && total > 0;

  return {
    title: media.title,
    kind: KIND[type],
    meta: inProgress ? `E${watched} / ${total}` : media.year ? String(media.year) : KIND[type],
    progress: inProgress ? Math.round((watched / total) * 100) : undefined,
    poster: media.poster ? `https://simkl.in/posters/${media.poster}_m.webp` : undefined,
    href: `https://simkl.com/${URL_SEGMENT[type]}/${media.ids.simkl}${media.ids.slug ? `/${media.ids.slug}` : ""}`,
  };
}

async function api<T>(path: string): Promise<T | null> {
  const clientId = process.env.SIMKL_CLIENT_ID ?? "";
  const token = process.env.SIMKL_ACCESS_TOKEN ?? "";

  // Simkl's debug log identifies the app by these URL params.
  const params = new URLSearchParams({ client_id: clientId, "app-name": APP_NAME, "app-version": APP_VERSION });
  const res = await fetch(`${API}${path}?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "simkl-api-key": clientId,
      "User-Agent": `${APP_NAME}/${APP_VERSION}`,
    },
    // Cache the results below, not the fetches, so the access token never lands in the data cache.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Simkl ${path} failed: ${res.status}`);

  // Simkl answers an empty result with an empty body (or `null`).
  const text = await res.text();
  return text ? (JSON.parse(text) as T | null) : null;
}

const getLastActivity = unstable_cache(
  async () => (await api<{ all?: string | null }>("/sync/activities"))?.all ?? null,
  ["simkl-activities"],
  { revalidate: ACTIVITIES_REVALIDATE },
);

// The last-activity timestamp is only a cache key: a change on Simkl busts the cached library straight away.
const getLibrary = unstable_cache(
  async (_lastActivity: string | null) => (await api<Library>("/sync/all-items")) ?? {},
  ["simkl-library"],
  { revalidate: LIBRARY_REVALIDATE },
);

type Entry = { raw: RawItem; item: WatchItem };

function entries(library: Library, status: Status): Entry[] {
  return TYPES.flatMap((type) =>
    (library[type] ?? []).flatMap((raw) => {
      if (raw.status !== status) return [];
      const item = toWatchItem(raw, type, status);
      return item ? [{ raw, item }] : [];
    }),
  );
}

const newestBy = (field: "last_watched_at" | "added_to_watchlist_at") => (a: Entry, b: Entry) =>
  (b.raw[field] ?? "").localeCompare(a.raw[field] ?? "");

const items = (list: Entry[]) => list.map((e) => e.item).slice(0, LIMIT);

export async function getWatchLists(): Promise<WatchLists> {
  if (!process.env.SIMKL_CLIENT_ID || !process.env.SIMKL_ACCESS_TOKEN) return EMPTY;

  try {
    // Sequential on purpose: check activities first, then fetch the library only if needed.
    const library = await getLibrary(await getLastActivity());

    return {
      // Movies have no "watching" status on Simkl.
      watching: items(entries(library, "watching").toSorted(newestBy("last_watched_at"))),
      completed: items(entries(library, "completed").toSorted(newestBy("last_watched_at"))),
      planned: items(entries(library, "plantowatch").toSorted(newestBy("added_to_watchlist_at"))),
    };
  } catch (err) {
    console.error(err);
    return EMPTY;
  }
}
