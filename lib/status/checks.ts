import "server-only";
import { getAccessToken } from "@/lib/spotify";
import { classifyIndicator } from "./classify";
import type { Status } from "./types";

/*
 * Every external service the site depends on. To monitor a new integration, add an entry.
 * A probe returns null when the service isn't configured, otherwise the response to judge.
 * Never put secrets in thrown errors: the runner only logs the check id and error name.
 */

export type ProbeResult = { ok: boolean; code?: number; reported?: Status };

export type Check = {
  id: string;
  name: string;
  description: string;
  probe: (signal: AbortSignal) => Promise<ProbeResult | null>;
};

const asResult = (res: Response): ProbeResult => ({ ok: res.ok, code: res.ok ? undefined : res.status });

/** Public Atlassian Statuspage feed (e.g. githubstatus.com). */
const statuspage = (base: string) => async (signal: AbortSignal) => {
  const res = await fetch(`${base}/api/v2/status.json`, { signal, cache: "no-store" });
  if (!res.ok) return asResult(res);
  const body = (await res.json()) as { status?: { indicator?: string } };
  return { ok: true, reported: classifyIndicator(body.status?.indicator ?? "unknown") };
};

export const checks: Check[] = [
  {
    id: "spotify",
    name: "Spotify",
    description: "Top track in After hours › Music",
    async probe(signal) {
      const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
      if (!id || !secret || !refresh) return null;
      const token = await getAccessToken(id, secret, refresh, signal);
      const res = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
        cache: "no-store",
      });
      return asResult(res);
    },
  },
  {
    id: "simkl",
    name: "Simkl",
    description: "Watch lists in After hours",
    async probe(signal) {
      const { SIMKL_CLIENT_ID: id, SIMKL_ACCESS_TOKEN: token } = process.env;
      if (!id || !token) return null;
      const res = await fetch("https://api.simkl.com/sync/activities?app-name=richardsaseun-portfolio&app-version=1.0", {
        headers: { Authorization: `Bearer ${token}`, "simkl-api-key": id },
        signal,
        cache: "no-store",
      });
      return asResult(res);
    },
  },
  {
    id: "steam",
    name: "Steam",
    description: "Game library in After hours",
    async probe(signal) {
      const { STEAM_API_KEY: key, STEAM_ID: steamId } = process.env;
      if (!key || !steamId) return null;
      // Same endpoint as lib/steam.ts. The key rides in the query string, so never log or return this URL.
      const params = new URLSearchParams({ key, steamid: steamId, format: "json" });
      const res = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?${params}`, {
        signal,
        cache: "no-store",
      });
      return asResult(res);
    },
  },
  {
    id: "github",
    name: "GitHub",
    description: "Content editing via Keystatic",
    probe: statuspage("https://www.githubstatus.com"),
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Hosting and deployments",
    probe: statuspage("https://www.vercel-status.com"),
  },
];
