import type { Plugin, ViteDevServer, PreviewServer } from "vite";
export function liveFixturePlugin({
  segmentsBase = "/tests/fixtures/streams/hls",
}: { segmentsBase?: string } = {}): Plugin {
  const sessions = new Map<string, number>();
  function install(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith("/live-fixture/stream.m3u8")) return next();
      const id =
        new URL(req.url, "http://localhost").searchParams.get("session") ??
        "default";
      if (!sessions.has(id)) sessions.set(id, Date.now());
      const elapsed = (Date.now() - sessions.get(id)!) / 1000,
        first = Math.max(0, Math.min(3, Math.floor(elapsed / 2))),
        last = Math.min(5, first + 2);
      let manifest =
        "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:" +
        first +
        "\n";
      for (let i = first; i <= last; i++)
        manifest +=
          "#EXTINF:2.0,\n" +
          segmentsBase +
          "/segment" +
          String(i).padStart(2, "0") +
          ".mpegts\n";
      if (elapsed > 16) manifest += "#EXT-X-ENDLIST\n";
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-store");
      res.end(manifest);
    });
  }
  return {
    name: "live-test-fixture",
    configureServer: install,
    configurePreviewServer: install,
  };
}
