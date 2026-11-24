import { beforeEach, expect, test, vi } from "vitest";
import { createNativeAdapter } from "../../packages/providers/src/native";
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
async function make() {
  const host = document.createElement("div");
  const adapter = await createNativeAdapter({
    host,
    source: { type: "file", src: "/signed?token=123" },
    kind: "video",
    signal: new AbortController().signal,
  });
  return { host, adapter, media: host.querySelector("video")! };
}
test("loads explicit file URL without relying on an extension", async () => {
  const { media, adapter } = await make();
  expect(media.getAttribute("src")).toBe("/signed?token=123");
  expect(media.autoplay).toBe(false);
  adapter.destroy();
});
test("normalizes unknown duration without reporting an error or infinity", async () => {
  const { media, adapter } = await make();
  Object.defineProperty(media, "duration", {
    value: Infinity,
    configurable: true,
  });
  media.dispatchEvent(new Event("durationchange"));
  expect(adapter.getSnapshot().duration).toBeNull();
  expect(adapter.getSnapshot().live).toBe(false);
  adapter.destroy();
});
test("reports rejected play and does not pretend playback started", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(
    new DOMException("blocked", "NotAllowedError"),
  );
  const { adapter } = await make();
  expect(await adapter.execute({ type: "play" })).toMatchObject({
    ok: false,
    error: { code: "blocked" },
  });
  expect(adapter.getSnapshot().status).not.toBe("playing");
  adapter.destroy();
});
test("clamps a seek within valid ranges and ignores events after destroy", async () => {
  const { media, adapter, host } = await make();
  Object.defineProperty(media, "duration", { value: 100 });
  Object.defineProperty(media, "seekable", {
    value: { length: 1, start: () => 10, end: () => 80 },
  });
  media.dispatchEvent(new Event("loadedmetadata"));
  await adapter.execute({ type: "seek", time: 99 });
  expect(media.currentTime).toBe(80);
  adapter.destroy();
  media.dispatchEvent(new Event("playing"));
  expect(host.children.length).toBe(0);
  expect(await adapter.execute({ type: "play" })).toMatchObject({
    ok: false,
    error: { code: "aborted" },
  });
});
