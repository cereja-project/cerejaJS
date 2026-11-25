import type { AdapterFactory, TrackInfo } from "@cereja-project/ui-core";
import { createNativeController } from "./native";
import { augmentAdapter } from "./augment";
import { failure, safeMediaUrl } from "./errors";
export const createHlsAdapter: AdapterFactory = async (options) => {
  if (options.source.type !== "hls") throw new Error("Esperada fonte HLS.");
  const src = safeMediaUrl(options.source.src);
  const probe = document.createElement(options.kind);
  const nativeSupport = !!probe.canPlayType("application/vnd.apple.mpegurl");
  const { default: Hls } = nativeSupport
    ? { default: null }
    : await import("hls.js");
  if (options.signal.aborted) throw new DOMException("Aborted", "AbortError");
  if (!nativeSupport && !Hls?.isSupported())
    throw new Error("HLS não suportado neste navegador.");
  const base = createNativeController(options);
  if (nativeSupport) {
    base.media.src = src;
    // Native HLS does not expose manifest live metadata reliably; retain live=false
    // until a finite moving window is observable rather than using Infinity alone.
    let previousStart: number | null = null;
    const off = base.subscribe(() => {
      const s = base.getSnapshot(),
        start = s.seekable[0]?.start;
      if (start !== undefined) {
        if (previousStart !== null && start > previousStart && !s.live)
          base.patch({ live: true });
        previousStart = start;
      }
    });
    const original = base.destroy;
    return {
      ...base,
      destroy() {
        off();
        original();
      },
    };
  }
  const engine = new Hls!({ autoStartLoad: true });
  let live = false;
  const adapter = augmentAdapter(
    base,
    (s) => {
      const tracks: TrackInfo[] = [
        ...s.tracks.filter(
          (t) =>
            (t.kind !== "captions" && t.kind !== "subtitles") ||
            engine.subtitleTracks.length === 0,
        ),
        ...engine.subtitleTracks.map((t, i) => ({
          id: `subtitle:${i}`,
          kind: "subtitles" as const,
          label:
            t.name || t.lang || `${options.labels?.track ?? "Faixa"} ${i + 1}`,
          language: t.lang,
        })),
        ...engine.audioTracks.map((t, i) => ({
          id: `audio:${i}`,
          kind: "audio" as const,
          label:
            t.name || t.lang || `${options.labels?.track ?? "Faixa"} ${i + 1}`,
          language: t.lang,
        })),
        {
          id: "quality:-1",
          kind: "quality",
          label: options.labels?.automatic ?? "Automática",
        },
        ...engine.levels.map((l, i) => ({
          id: `quality:${i}`,
          kind: "quality" as const,
          label: l.height
            ? `${l.height}p`
            : `${Math.round(l.bitrate / 1000)} kbps`,
        })),
      ];
      return {
        ...s,
        live,
        tracks,
        selectedTrackIds: {
          ...s.selectedTrackIds,
          quality: `quality:${engine.autoLevelEnabled ? -1 : engine.currentLevel}`,
          audio: `audio:${engine.audioTrack}`,
          subtitles:
            engine.subtitleTrack >= 0
              ? `subtitle:${engine.subtitleTrack}`
              : undefined,
        },
        capabilities: {
          ...s.capabilities,
          captions: engine.subtitleTracks.length > 0 || s.capabilities.captions,
          audioTracks: engine.audioTracks.length > 0,
          quality: engine.levels.length > 1,
        },
      };
    },
    async (command) => {
      if (command.type === "goLive") {
        const target = engine.liveSyncPosition;
        if (!live || target === null)
          return failure("unsupported", "Transmissão sem janela navegável.");
        return base.execute({ type: "seek", time: target });
      }
      if (command.type !== "selectTrack") return null;
      if (
        (command.kind === "captions" || command.kind === "subtitles") &&
        engine.subtitleTracks.length === 0
      )
        return base.execute(command);
      if (
        command.id === null &&
        (command.kind === "captions" || command.kind === "subtitles")
      ) {
        engine.subtitleTrack = -1;
        engine.subtitleDisplay = false;
        adapter.refresh();
        return { ok: true };
      }
      const track = adapter
        .getSnapshot()
        .tracks.find((t) => t.id === command.id && t.kind === command.kind);
      if (!track) return failure("unsupported", "Faixa indisponível.");
      const index = Number(track.id.split(":")[1]);
      if (track.kind === "audio") engine.audioTrack = index;
      else if (track.kind === "quality") engine.currentLevel = index;
      else {
        engine.subtitleTrack = index;
        engine.subtitleDisplay = true;
      }
      adapter.refresh();
      return { ok: true };
    },
    () => {
      engine.destroy();
      options.signal.removeEventListener("abort", adapter.destroy);
    },
  );
  engine.on(Hls!.Events.MEDIA_ATTACHED, () => engine.loadSource(src));
  engine.on(Hls!.Events.LEVEL_LOADED, (_, data) => {
    live = !!data.details.live;
    adapter.refresh();
  });
  for (const event of [
    Hls!.Events.MANIFEST_PARSED,
    Hls!.Events.LEVEL_SWITCHED,
    Hls!.Events.AUDIO_TRACK_SWITCHED,
    Hls!.Events.SUBTITLE_TRACK_SWITCH,
  ])
    engine.on(event, () => adapter.refresh());
  engine.on(Hls!.Events.ERROR, (_, data) => {
    if (data.fatal)
      base.patch({
        status: "error",
        error: {
          code: "network",
          message: "Não foi possível carregar a transmissão HLS.",
          recoverable: true,
          cause: data,
        },
      });
  });
  options.signal.addEventListener("abort", adapter.destroy, { once: true });
  engine.attachMedia(base.media);
  return adapter;
};
