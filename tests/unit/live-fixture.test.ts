import { expect, test, vi } from "vitest";
import type { Connect } from "vite";
import { liveFixturePlugin } from "../fixtures/streams/server";
test("serves a sliding HLS window using the catalog asset path", async () => {
  vi.useFakeTimers();
  try {
    vi.setSystemTime(10000);
    let handler!: Connect.NextHandleFunction;
    const plugin = liveFixturePlugin({ segmentsBase: "/fixtures/streams/hls" });
    const configure = plugin.configureServer as (server: unknown) => void;
    configure({
      middlewares: {
        use(fn: Connect.NextHandleFunction) {
          handler = fn;
        },
      },
    });
    async function read() {
      let text = "";
      await handler(
        {
          url: "/live-fixture/stream.m3u8?session=test",
        } as Connect.IncomingMessage,
        {
          setHeader() {},
          end(value: string) {
            text = value;
          },
        } as never,
        () => {
          throw new Error("Unexpected fallback");
        },
      );
      return text;
    }
    expect(await read()).toContain(
      "\n/fixtures/streams/hls/segment00.mpegts\n",
    );
    vi.setSystemTime(16000);
    expect(await read()).toContain("#EXT-X-MEDIA-SEQUENCE:3");
    vi.setSystemTime(28000);
    expect(await read()).toContain("#EXT-X-ENDLIST");
  } finally {
    vi.useRealTimers();
  }
});
