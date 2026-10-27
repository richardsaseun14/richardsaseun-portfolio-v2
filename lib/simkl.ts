import "server-only";

/* Live watch lists from Simkl (https://simkl.docs.apiary.io). Server-only: reads the API token. */

const API = "https://api.simkl.com";
const REVALIDATE = 3600;
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
  last_watched_at?: string;
  added_to_watchlist_at?: string;
  watched_episodes_count?: number;
  total_episodes_count?: number;
};

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

async function fetchList(type: ListType, status: Status, clientId: string, token: string) {
  // Simkl's debug log identifies the app by these URL params.
  const params = new URLSearchParams({ client_id: clientId, "app-name": "richardsaseun-portfolio", "app-version": "1.0" });
  const res = await fetch(`${API}/sync/all-items/${type}/${status}?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "simkl-api-key": clientId },
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) throw new Error(`Simkl ${type}/${status} failed: ${res.status}`);

  // Simkl answers an empty list with an empty body (or `null`).
  const text = await res.text();
  const body = text ? (JSON.parse(text) as Partial<Record<ListType, RawItem[]>> | null) : null;
  const items = body?.[type] ?? [];

  return items.map((raw) => ({ raw, item: toWatchItem(raw, type, status) }));
}

type Entry = Awaited<ReturnType<typeof fetchList>>[number];

const newestBy = (field: "last_watched_at" | "added_to_watchlist_at") => (a: Entry, b: Entry) =>
  (b.raw[field] ?? "").localeCompare(a.raw[field] ?? "");

async function collect(types: ListType[], status: Status, clientId: string, token: string) {
  const results = await Promise.allSettled(types.map((t) => fetchList(t, status, clientId, token)));
  return results.flatMap((r) => {
    if (r.status === "fulfilled") return r.value;
    console.error(r.reason);
    return [];
  });
}

const items = (entries: Entry[]) => entries.flatMap((e) => (e.item ? [e.item] : [])).slice(0, LIMIT);

export async function getWatchLists(): Promise<WatchLists> {
  const clientId = process.env.SIMKL_CLIENT_ID;
  const token = process.env.SIMKL_ACCESS_TOKEN;
  if (!clientId || !token) return EMPTY;

  const [watching, completed, planned] = await Promise.all([
    // Movies have no "watching" status on Simkl.
    collect(["shows", "anime"], "watching", clientId, token),
    collect(["shows", "anime", "movies"], "completed", clientId, token),
    collect(["shows", "anime", "movies"], "plantowatch", clientId, token),
  ]);

  return {
    watching: items(watching.toSorted(newestBy("last_watched_at"))),
    completed: items(completed.toSorted(newestBy("last_watched_at"))),
    planned: items(planned.toSorted(newestBy("added_to_watchlist_at"))),
  };
}
