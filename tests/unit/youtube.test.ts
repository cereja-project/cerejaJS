import { expect, test, vi } from "vitest";
import { loadSdk } from "../../packages/providers/src/sdk-loader";
const sdkEvents: Array<YT.Events> = [];
test("shares SDK load across two consumers and allows explicit retry after failure", async () => {
  let calls = 0;
  const load = async () => {
    calls++;
    return { sdk: true };
  };
  const [a, b] = await Promise.all([
    loadSdk("shared-test", load),
    loadSdk("shared-test", load),
  ]);
  expect(calls).toBe(1);
  expect(a).toBe(b);
  let attempts = 0;
  const retry = async () => {
    attempts++;
    if (attempts === 1) throw new Error("offline");
    return "ready";
  };
  await expect(loadSdk("retry-test", retry)).rejects.toThrow("offline");
  expect(await loadSdk("retry-test", retry)).toBe("ready");
  expect(attempts).toBe(2);
});
import { getEmbedUrl } from "../../packages/providers/src/embed-url";
test("validates external iframe hosts and keeps provider captions in native UI", () => {
  expect(getEmbedUrl({ type: "youtube", id: "M7lc1UVf-VE" }).hostname).toBe(
    "www.youtube-nocookie.com",
  );
  expect(() =>
    getEmbedUrl({
      type: "youtube",
      id: "M7lc1UVf-VE",
      embedUrl: "https://evil.test/embed/M7lc1UVf-VE",
    }),
  ).toThrow();
  expect(() => getEmbedUrl({ type: "youtube", id: "../bad" })).toThrow();
});
import { createYouTubeAdapter } from "../../packages/providers/src/youtube";
test("keeps provider controls and cleans a ready or aborted iframe", async () => {
  class FakePlayer {
    constructor(
      private iframe: HTMLIFrameElement,
      options: YT.PlayerOptions,
    ) {
      sdkEvents.push(options.events!);
      queueMicrotask(() =>
        options.events?.onReady?.({ target: this as unknown as YT.Player }),
      );
    }
    getDuration() {
      return 100;
    }
    getCurrentTime() {
      return 0;
    }
    getPlayerState() {
      return 2;
    }
    getVolume() {
      return 100;
    }
    isMuted() {
      return false;
    }
    getPlaybackRate() {
      return 1;
    }
    getAvailablePlaybackRates() {
      return [1];
    }
    destroy() {
      this.iframe.remove();
    }
  }
  Object.assign(window, {
    YT: {
      Player: FakePlayer,
      PlayerState: { PLAYING: 1, PAUSED: 2, BUFFERING: 3, ENDED: 0 },
    },
  });
  const host = document.createElement("div"),
    signal = new AbortController();
  const adapter = await createYouTubeAdapter({
    host,
    signal: signal.signal,
    source: { type: "youtube", id: "M7lc1UVf-VE" },
    kind: "video",
  });
  expect(
    new URL(host.querySelector("iframe")!.src).searchParams.get("controls"),
  ).toBe("1");
  expect(adapter.getSnapshot().capabilities.captions).toBe(false);
  expect(
    await adapter.execute({
      type: "selectTrack",
      kind: "captions",
      id: "unknown",
    }),
  ).toMatchObject({ ok: false, error: { code: "unsupported" } });
  signal.abort();
  expect(host.children.length).toBe(0);
  expect(await adapter.execute({ type: "play" })).toMatchObject({
    ok: false,
    error: { code: "aborted" },
  });
  const aborted = new AbortController();
  aborted.abort();
  await expect(
    createYouTubeAdapter({
      host,
      signal: aborted.signal,
      source: { type: "youtube", id: "M7lc1UVf-VE" },
      kind: "video",
    }),
  ).rejects.toThrow();
  expect(host.children.length).toBe(0);
});
test("normalizes invalid iframe metadata before exposing ranges or controls", async () => {
  const api = (window as unknown as { YT: typeof YT }).YT;
  vi.spyOn(api.Player.prototype, "getDuration").mockReturnValue(Infinity);
  vi.spyOn(api.Player.prototype, "getCurrentTime").mockReturnValue(Infinity);
  vi.spyOn(api.Player.prototype, "getVolume").mockReturnValue(NaN);
  vi.spyOn(api.Player.prototype, "getPlaybackRate").mockReturnValue(Infinity);
  const a = await createYouTubeAdapter({
    host: document.createElement("div"),
    signal: new AbortController().signal,
    source: { type: "youtube", id: "M7lc1UVf-VE" },
    kind: "video",
  });
  expect(a.getSnapshot()).toMatchObject({
    duration: null,
    currentTime: 0,
    volume: 1,
    playbackRate: 1,
    seekable: [],
    capabilities: { seek: false },
  });
  a.destroy();
});
test("keeps a terminal YouTube error until explicit reload instead of masking it during polling", async () => {
  const api = (window as unknown as { YT: typeof YT }).YT;
  let polls = 0;
  vi.spyOn(api.Player.prototype, "getPlayerState").mockImplementation(() => {
    polls++;
    return 2;
  });
  const a = await createYouTubeAdapter({
    host: document.createElement("div"),
    signal: new AbortController().signal,
    source: { type: "youtube", id: "M7lc1UVf-VE" },
    kind: "video",
    settings: { pollInterval: 5 },
  });
  sdkEvents.at(-1)!.onError?.({ data: 101, target: {} as YT.Player });
  expect(a.getSnapshot().status).toBe("error");
  await vi.waitFor(() => expect(polls).toBeGreaterThan(1));
  expect(a.getSnapshot().status).toBe("error");
  a.destroy();
});
