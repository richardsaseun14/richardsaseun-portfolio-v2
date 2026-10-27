import "server-only";
import { unstable_cache } from "next/cache";

/* Top track from Spotify (https://developer.spotify.com/documentation/web-api). Server-only: reads the API secrets. */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";
const REVALIDATE = 3600;

export type TopTrack = { title: string; artist: string; cover?: string; href: string };

type RawTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string; width?: number }[] };
  external_urls: { spotify: string };
};

export function toTopTrack(raw: RawTrack): TopTrack {
  return {
    title: raw.name,
    artist: raw.artists.map((a) => a.name).join(", "),
    // Spotify lists album images largest first.
    cover: raw.album.images[0]?.url,
    href: raw.external_urls.spotify,
  };
}

export async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string, signal?: AbortSignal) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const body = (await res.json()) as { access_token: string };
  return body.access_token;
}

async function fetchTopTrack(): Promise<TopTrack | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const token = await getAccessToken(clientId, clientSecret, refreshToken);
    const res = await fetch(`${API}/me/top/tracks?time_range=short_term&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Spotify top tracks failed: ${res.status}`);
    const body = (await res.json()) as { items: RawTrack[] };
    return body.items[0] ? toTopTrack(body.items[0]) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/** Most-played track over roughly the last four weeks, or null when unconfigured or unavailable. */
// Cache the result, not the fetches, so the short-lived access token never lands in the data cache.
export const getTopTrack = unstable_cache(fetchTopTrack, ["spotify-top-track"], { revalidate: REVALIDATE });
