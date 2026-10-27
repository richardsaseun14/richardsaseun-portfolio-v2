import "server-only";

/* Recently played games from Steam (https://developer.valvesoftware.com/wiki/Steam_Web_API). Server-only: reads the API key. */

const API = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
const CDN = "https://cdn.akamai.steamstatic.com/steam/apps";
const REVALIDATE = 3600;
const PLAYING_LIMIT = 4;
const RECENT_LIMIT = 6;
const RECENT_WINDOW_DAYS = 183;
const DAY = 86_400;

type Section = "playing" | "recent";

export type GameItem = {
  title: string;
  appid: number;
  cover: string;
  fallbackCover: string;
  href: string;
  meta: string;
};

export type GameLists = { playing: GameItem[]; recent: GameItem[] };

/** Why `getGames()` returned what it did, so the page can show which source feeds the carousels. */
export type GamesStatus = "ok" | "no-credentials" | "api-error" | "no-recent-games";

export type GamesResult = GameLists & { status: GamesStatus };

type RawGame = {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  rtime_last_played?: number;
};

const EMPTY: GameLists = { playing: [], recent: [] };
const empty = (status: GamesStatus): GamesResult => ({ ...EMPTY, status });

/** Floored, never overstates: `<1 hr`, `4 hrs`, `40+ hrs`, `200+ hrs`. */
export function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours < 1) return "<1 hr";
  if (hours === 1) return "1 hr";
  if (hours < 10) return `${hours} hrs`;
  const step = hours < 100 ? 10 : 50;
  return `${Math.floor(hours / step) * step}+ hrs`;
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

function formatAgo(unixSeconds: number, nowMs: number): string {
  const days = Math.max(0, Math.floor((nowMs / 1000 - unixSeconds) / DAY));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 35) return `${plural(Math.floor(days / 7), "week")} ago`;
  return `${plural(Math.floor(days / 30), "month")} ago`;
}

export function toGameItem(raw: RawGame, section: Section, nowMs: number = Date.now()): GameItem | null {
  if (raw.playtime_forever <= 0) return null;

  let meta: string;
  if (section === "playing") {
    if (!raw.playtime_2weeks) return null;
    meta = `${formatPlaytime(raw.playtime_2weeks)} this fortnight`;
  } else {
    if (!raw.rtime_last_played) return null;
    meta = `Played ${formatAgo(raw.rtime_last_played, nowMs)} · ${formatPlaytime(raw.playtime_forever)}`;
  }

  return {
    title: raw.name,
    appid: raw.appid,
    cover: `${CDN}/${raw.appid}/library_600x900.jpg`,
    fallbackCover: `${CDN}/${raw.appid}/header.jpg`,
    href: `https://store.steampowered.com/app/${raw.appid}`,
    meta,
  };
}

const present = <T>(x: T | null): x is T => x !== null;

export function selectGames(raws: RawGame[], nowMs: number = Date.now()): GameLists {
  const playingRaws = raws
    .filter((r) => (r.playtime_2weeks ?? 0) > 0)
    .toSorted((a, b) => (b.playtime_2weeks ?? 0) - (a.playtime_2weeks ?? 0))
    .slice(0, PLAYING_LIMIT);
  const shown = new Set(playingRaws.map((r) => r.appid));
  const cutoff = nowMs / 1000 - RECENT_WINDOW_DAYS * DAY;

  const playing = playingRaws.map((r) => toGameItem(r, "playing", nowMs)).filter(present);
  const recent = raws
    .filter((r) => !shown.has(r.appid) && (r.rtime_last_played ?? 0) >= cutoff)
    .toSorted((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))
    .map((r) => toGameItem(r, "recent", nowMs))
    .filter(present)
    .slice(0, RECENT_LIMIT);

  return { playing, recent };
}

export async function getGames(): Promise<GamesResult> {
  const key = process.env.STEAM_API_KEY;
  const steamId = process.env.STEAM_ID;
  if (!key || !steamId) return empty("no-credentials");

  // The key rides in the query string, so never log this URL; log status codes only.
  const url = `${API}?${new URLSearchParams({ key, steamid: steamId, include_appinfo: "1", format: "json" })}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) {
      console.error(`Steam GetOwnedGames failed: ${res.status}`);
      return empty("api-error");
    }
    // A private "Game details" setting answers `{ response: {} }`, which reads as no data.
    const body = (await res.json()) as { response?: { games?: RawGame[] } };
    const lists = selectGames(body.response?.games ?? []);
    const hasGames = lists.playing.length + lists.recent.length > 0;
    return { ...lists, status: hasGames ? "ok" : "no-recent-games" };
  } catch {
    console.error("Steam GetOwnedGames request failed");
    return empty("api-error");
  }
}
