import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { checks } from "./checks";

const simkl = checks.find((check) => check.id === "simkl")!;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Simkl health probe", () => {
  it("uses the refresh-token grant without a legacy access token", async () => {
    vi.stubEnv("SIMKL_CLIENT_ID", "test-client");
    vi.stubEnv("SIMKL_REFRESH_TOKEN", "test-refresh");
    vi.stubEnv("SIMKL_ACCESS_TOKEN", "");
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ access_token: "fresh-access" }))
      .mockResolvedValueOnce(Response.json({ all: "2026-10-27" }));
    vi.stubGlobal("fetch", fetchMock);
    const signal = new AbortController().signal;

    expect(await simkl.probe(signal)).toEqual({ ok: true, code: undefined });
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.simkl.com/oauth2/token");
    expect(fetchMock.mock.calls[0][1].body.get("refresh_token")).toBe("test-refresh");
    expect(fetchMock.mock.calls[1][1]).toMatchObject({
      signal,
      headers: { Authorization: "Bearer fresh-access" },
    });
  });

  it("is unconfigured when only the legacy access token exists", async () => {
    vi.stubEnv("SIMKL_CLIENT_ID", "test-client");
    vi.stubEnv("SIMKL_REFRESH_TOKEN", "");
    vi.stubEnv("SIMKL_ACCESS_TOKEN", "legacy-access");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await simkl.probe(new AbortController().signal)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stops waiting when the probe is aborted during token refresh", async () => {
    vi.stubEnv("SIMKL_CLIENT_ID", "test-client");
    vi.stubEnv("SIMKL_REFRESH_TOKEN", "test-refresh");
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    const controller = new AbortController();
    const result = simkl.probe(controller.signal);
    controller.abort();

    await expect(result).rejects.toMatchObject({ name: "AbortError" });
  });

  it("preserves a failing upstream HTTP code", async () => {
    vi.stubEnv("SIMKL_CLIENT_ID", "test-client");
    vi.stubEnv("SIMKL_REFRESH_TOKEN", "test-refresh");
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(Response.json({ access_token: "fresh-access" }))
      .mockResolvedValueOnce(new Response(null, { status: 503 })));

    expect(await simkl.probe(new AbortController().signal)).toEqual({ ok: false, code: 503 });
  });
});
