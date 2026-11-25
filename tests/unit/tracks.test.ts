import { expect, test, vi } from "vitest";
import { attachTextTracks } from "../../packages/core/src";
import { createNativeController } from "../../packages/providers/src/native";
test("invalid later track does not partially modify the media", () => {
  const media = document.createElement("video");
  expect(() =>
    attachTextTracks(media, [
      {
        id: "a",
        src: "/a.vtt",
        language: "pt",
        label: "Português",
        kind: "captions",
      },
      {
        id: "b",
        src: "javascript:invalid",
        language: "en",
        label: "English",
        kind: "captions",
      },
    ]),
  ).toThrow();
  expect(media.children.length).toBe(0);
});
test("synthetic native track names accept adapter translations", () => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
  const adapter = createNativeController({
    host: document.createElement("div"),
    kind: "video",
    source: { type: "file", src: "/a" },
    signal: new AbortController().signal,
    labels: { automatic: "Automatic", track: "Track" },
  });
  (adapter.media.textTracks as unknown as Array<unknown>).push({
    id: "a",
    kind: "captions",
    language: "",
    label: "",
    mode: "disabled",
  });
  adapter.refresh();
  expect(adapter.getSnapshot().tracks[0].label).toBe("Track 1");
  adapter.destroy();
});
