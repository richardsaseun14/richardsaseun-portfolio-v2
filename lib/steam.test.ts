import { describe, expect, it } from "vitest";
import { formatPlaytime, selectGames, toGameItem } from "./steam";

const NOW = Date.UTC(2026, 9, 27) / 1000;
const DAY = 86_400;
const daysAgo = (n: number) => NOW - n * DAY;
const nowMs = NOW * 1000;

describe("formatPlaytime", () => {
  const cases: [number, string][] = [
    [0, "<1 hr"],
    [59, "<1 hr"],
    [60, "1 hr"],
    [119, "1 hr"],
    [240, "4 hrs"],
    [599, "9 hrs"],
    [600, "10+ hrs"],
    [2_399, "30+ hrs"],
    [2_400, "40+ hrs"],
    [5_999, "90+ hrs"],
    [6_000, "100+ hrs"],
    [7_199, "100+ hrs"],
    [7_200, "100+ hrs"],
    [9_000, "150+ hrs"],
    [12_000, "200+ hrs"],
    [12_300, "200+ hrs"],
  ];
  for (const [minutes, expected] of cases) {
    it(`${minutes} min -> ${expected}`, () => expect(formatPlaytime(minutes)).toBe(expected));
  }
});

describe("toGameItem", () => {
  const base = { appid: 570, name: "Dota 2", playtime_forever: 9_000, rtime_last_played: daysAgo(21) };

  it("maps a playing-now game with a fortnight meta", () => {
    const item = toGameItem({ ...base, playtime_2weeks: 380 }, "playing", nowMs);
    expect(item).toStrictEqual({
      title: "Dota 2",
      appid: 570,
      cover: "https://cdn.akamai.steamstatic.com/steam/apps/570/library_600x900.jpg",
      fallbackCover: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
      href: "https://store.steampowered.com/app/570",
      meta: "6 hrs this fortnight",
    });
  });

  it("maps a recently played game with a relative date and total playtime", () => {
    const item = toGameItem(base, "recent", nowMs);
    expect(item?.meta).toBe("Played 3 weeks ago · 150+ hrs");
  });

  it("returns null for a game with no playtime", () => {
    expect(toGameItem({ ...base, playtime_forever: 0 }, "recent", nowMs)).toBe(null);
  });

  it("returns null for a playing-now game without two-week playtime", () => {
    expect(toGameItem(base, "playing", nowMs)).toBe(null);
  });

  it("words relative dates naturally", () => {
    const meta = (days: number) => toGameItem({ ...base, rtime_last_played: daysAgo(days) }, "recent", nowMs)?.meta;
    expect(meta(0) ?? "").toMatch(/^Played today/);
    expect(meta(1) ?? "").toMatch(/^Played yesterday/);
    expect(meta(4) ?? "").toMatch(/^Played 4 days ago/);
    expect(meta(7) ?? "").toMatch(/^Played 1 week ago/);
    expect(meta(60) ?? "").toMatch(/^Played 2 months ago/);
  });
});

describe("selectGames", () => {
  const game = (appid: number, over: Partial<Parameters<typeof toGameItem>[0]> = {}) => ({
    appid,
    name: `Game ${appid}`,
    playtime_forever: 600,
    rtime_last_played: daysAgo(10),
    ...over,
  });

  it("returns empty lists for no data (private profile)", () => {
    expect(selectGames([], nowMs)).toStrictEqual({ playing: [], recent: [] });
  });

  it("sorts playing now by two-week playtime and caps at 4", () => {
    const raws = [1, 2, 3, 4, 5].map((id) => game(id, { playtime_2weeks: id * 10 }));
    const { playing } = selectGames(raws, nowMs);
    expect(playing.map((g) => g.appid)).toStrictEqual([5, 4, 3, 2]);
  });

  it("fills recently played by last played, excluding games shown in playing now", () => {
    const raws = [
      game(1, { playtime_2weeks: 100 }),
      game(2, { rtime_last_played: daysAgo(40) }),
      game(3, { rtime_last_played: daysAgo(20) }),
    ];
    const { playing, recent } = selectGames(raws, nowMs);
    expect(playing.map((g) => g.appid)).toStrictEqual([1]);
    expect(recent.map((g) => g.appid)).toStrictEqual([3, 2]);
  });

  it("keeps playing-now overflow eligible for recently played", () => {
    const raws = [1, 2, 3, 4, 5].map((id) => game(id, { playtime_2weeks: id * 10, rtime_last_played: daysAgo(id) }));
    const { recent } = selectGames(raws, nowMs);
    expect(recent.map((g) => g.appid)).toStrictEqual([1]);
  });

  it("drops games older than six months and games with zero playtime", () => {
    const raws = [
      game(1, { rtime_last_played: daysAgo(200) }),
      game(2, { playtime_forever: 0 }),
      game(3, { rtime_last_played: 0 }),
      game(4),
    ];
    expect(selectGames(raws, nowMs).recent.map((g) => g.appid)).toStrictEqual([4]);
  });

  it("caps recently played at 6", () => {
    const raws = Array.from({ length: 9 }, (_, i) => game(i + 1, { rtime_last_played: daysAgo(i + 1) }));
    expect(selectGames(raws, nowMs).recent.length).toBe(6);
  });
});
