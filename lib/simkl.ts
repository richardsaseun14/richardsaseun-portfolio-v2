import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";

/*
 * Live watch lists from Simkl (https://api.simkl.org/guides/sync). Server-only: reads the refresh token.
 * Follows Simkl's sync model: a cheap /sync/activities check gates one /sync/all-items call,
 * so the library is only refetched when something changed (or daily, since episode counts
 * refresh without bumping activities).
 */

const API = "https://api.simkl.com";
const APP_NAME = "richardsaseun-portfolio";
const APP_VERSION = "1.0";
const USER_AGENT = `${APP_NAME}/${APP_VERSION}`;
const ACTIVITIES_REVALIDATE = 3600;
const LIBRARY_REVALIDATE = 86400;
const LIMIT = 12;
// Access tokens last 7 days; mint a new one every 6 so a cached token is always a day from expiry.
const TOKEN_WINDOW_MS = 6 * 24 * 60 * 60 * 1000;

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

/** Exchanges the long-lived refresh token for a new access token (https://api.simkl.org/api-reference/oauth2-tokens). */
async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.SIMKL_CLIENT_ID ?? "",
      refresh_token: process.env.SIMKL_REFRESH_TOKEN ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const { error } = ((await res.json().catch(() => ({}))) ?? {}) as { error?: string };
    // A failed refresh means the grant was revoked or unused for 180 days: re-authorize (see README).
    throw new Error(`Simkl token refresh failed: ${res.status} ${error ?? ""}`.trim());
  }
  return ((await res.json()) as { access_token: string }).access_token;
}

/*
 * Refreshing replaces the grant's access token, so every server instance shares one token from the
 * data cache instead of refreshing independently and cutting each other off. A new token is minted on
 * the first request of each window, and the window is shorter than the token's lifetime, so a cached
 * token never expires in use. No `revalidate`: a stale-while-revalidate refresh would kill the token
 * it was still serving.
 */
const cachedAccessToken = unstable_cache(
  async (_grant: string, _window: number) => refreshAccessToken(),
  ["simkl-access-token"],
);

function sharedAccessToken(): Promise<string> {
  // Key on a fingerprint of the refresh token, so a new one in the env starts a new cache entry.
  const grant = createHash("sha256").update(process.env.SIMKL_REFRESH_TOKEN ?? "").digest("hex").slice(0, 16);
  return cachedAccessToken(grant, Math.floor(Date.now() / TOKEN_WINDOW_MS));
}

function request(path: string, token: string): Promise<Response> {
  const clientId = process.env.SIMKL_CLIENT_ID ?? "";
  // Simkl's debug log identifies the app by these URL params.
  const params = new URLSearchParams({ client_id: clientId, "app-name": APP_NAME, "app-version": APP_VERSION });
  return fetch(`${API}${path}?${params}`, {
    headers: { Authorization: `Bearer ${token}`, "simkl-api-key": clientId, "User-Agent": USER_AGENT },
    // The results are cached below, not the raw fetches.
    cache: "no-store",
  });
}

async function api<T>(path: string): Promise<T | null> {
  let res = await request(path, await sharedAccessToken());
  // The shared token was invalidated (e.g. two instances minted one at once): refresh once and retry.
  if (res.status === 401) res = await request(path, await refreshAccessToken());
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
  if (!process.env.SIMKL_CLIENT_ID || !process.env.SIMKL_REFRESH_TOKEN) return EMPTY;

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
