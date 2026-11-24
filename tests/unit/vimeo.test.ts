import { expect, test, vi } from "vitest";
import { createVimeoAdapter } from "../../packages/providers/src/vimeo";
const state = vi.hoisted(() => ({
  rejectReady: false,
  instances: [] as Array<{ emit: (event: string, data: unknown) => void }>,
}));
vi.mock("@vimeo/player", () => ({
  default: class {
    listeners = new Map<string, Set<(x: unknown) => void>>();
    constructor() {
      state.instances.push(this);
    }
    ready() {
      return state.rejectReady
        ? Promise.reject(new Error("PrivacyError"))
        : Promise.resolve();
    }
    getDuration() {
      return Promise.resolve(100);
    }
    getCurrentTime() {
      return Promise.resolve(12);
    }
    getVolume() {
      return Promise.resolve(1);
    }
    getMuted() {
      return Promise.resolve(false);
    }
    getPlaybackRate() {
      return Promise.resolve(1);
    }
    getPaused() {
      return Promise.resolve(true);
    }
    getTextTracks() {
      return Promise.resolve([]);
    }
    getQualities() {
      return Promise.resolve([]);
    }
    getAudioTracks() {
      return Promise.resolve([]);
    }
    getQuality() {
      return Promise.resolve("auto");
    }
    play() {
      return Promise.reject(new Error("PasswordError"));
    }
    destroy() {
      return Promise.resolve();
    }
    on(event: string, fn: (x: unknown) => void) {
      if (!this.listeners.has(event)) this.listeners.set(event, new Set());
      this.listeners.get(event)!.add(fn);
    }
    off(event: string, fn: (x: unknown) => void) {
      this.listeners.get(event)?.delete(fn);
    }
    emit(event: string, data: unknown) {
      this.listeners.get(event)?.forEach((fn) => fn(data));
    }
  },
}));
test("reports rejected Vimeo commands and ignores events after destroy", async () => {
  const host = document.createElement("div"),
    controller = new AbortController();
  const a = await createVimeoAdapter({
    source: { type: "vimeo", id: "76979871" },
    kind: "video",
    host,
    signal: controller.signal,
  });
  expect(await a.execute({ type: "play" })).toMatchObject({ ok: false });
  expect(a.getSnapshot().status).toBe("paused");
  a.destroy();
  const snapshot = a.getSnapshot();
  state.instances
    .at(-1)!
    .emit("timeupdate", { seconds: 55, duration: 100, percent: 0.55 });
  expect(a.getSnapshot()).toBe(snapshot);
  expect(host.children.length).toBe(0);
  expect(await a.execute({ type: "play" })).toMatchObject({
    ok: false,
    error: { code: "aborted" },
  });
});
test("cleans restricted embeds and preserves authorized unlisted hash", async () => {
  state.rejectReady = true;
  const host = document.createElement("div");
  await expect(
    createVimeoAdapter({
      source: {
        type: "vimeo",
        id: "76979871",
        embedUrl: "https://player.vimeo.com/video/76979871?h=allowedhash",
      },
      kind: "video",
      host,
      signal: new AbortController().signal,
    }),
  ).rejects.toThrow();
  expect(host.children.length).toBe(0);
  state.rejectReady = false;
});
test("normalizes invalid Vimeo metadata before publishing a seek window", async () => {
  const { default: Player } = await import("@vimeo/player");
  vi.spyOn(Player.prototype, "getDuration").mockResolvedValue(Infinity);
  vi.spyOn(Player.prototype, "getCurrentTime").mockResolvedValue(NaN);
  vi.spyOn(Player.prototype, "getVolume").mockResolvedValue(NaN);
  vi.spyOn(Player.prototype, "getPlaybackRate").mockResolvedValue(Infinity);
  const a = await createVimeoAdapter({
    host: document.createElement("div"),
    signal: new AbortController().signal,
    source: { type: "vimeo", id: "76979871" },
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
