import type { AdapterFactory, TrackInfo } from "@cereja-project/ui-core";
import { createNativeController } from "./native";
import { augmentAdapter } from "./augment";
import { failure, safeMediaUrl } from "./errors";
export const createDashAdapter: AdapterFactory = async (options) => {
  if (options.source.type !== "dash") throw new Error("Esperada fonte DASH.");
  const src = safeMediaUrl(options.source.src);
  if (!("MediaSource" in window))
    throw new Error("DASH não suportado neste navegador.");
  const dash = await import("dashjs");
  if (options.signal.aborted) throw new DOMException("Aborted", "AbortError");
  const base = createNativeController(options),
    engine = dash.MediaPlayer().create();
  let ready = false;
  let auto = true;
  const audio = () => (ready ? engine.getTracksFor("audio") : []),
    text = () => (ready ? engine.getTracksFor("text") : []),
    qualities = () => (ready ? engine.getRepresentationsByType("video") : []);
  const adapter = augmentAdapter(
    base,
    (s) => {
      if (!ready) return s;
      const tracks: TrackInfo[] = [
        ...s.tracks.filter(
          (t) =>
            !["captions", "subtitles"].includes(t.kind) || text().length === 0,
        ),
        ...audio().map((t, i) => ({
          id: `audio:${i}`,
          kind: "audio" as const,
          label:
            t.labels?.[0]?.text ||
            t.lang ||
            `${options.labels?.track ?? "Faixa"} ${i + 1}`,
          language: t.lang ?? undefined,
        })),
        ...text().map((t, i) => ({
          id: `text:${i}`,
          kind: "subtitles" as const,
          label:
            t.labels?.[0]?.text ||
            t.lang ||
            `${options.labels?.track ?? "Faixa"} ${i + 1}`,
          language: t.lang ?? undefined,
        })),
        {
          id: "quality:auto",
          kind: "quality",
          label: options.labels?.automatic ?? "Automática",
        },
        ...qualities().map((t) => ({
          id: `quality:${t.id}`,
          kind: "quality" as const,
          label: t.height ? `${t.height}p` : `${t.bitrateInKbit} kbps`,
        })),
      ];
      return {
        ...s,
        live: engine.isDynamic(),
        tracks,
        capabilities: {
          ...s.capabilities,
          audioTracks: audio().length > 0,
          captions: text().length > 0 || s.capabilities.captions,
          quality: qualities().length > 1,
        },
        selectedTrackIds: {
          ...s.selectedTrackIds,
          audio: `audio:${audio().findIndex((t) => t === engine.getCurrentTrackFor("audio"))}`,
          subtitles: engine.isTextEnabled()
            ? `text:${engine.getCurrentTextTrackIndex()}`
            : undefined,
          quality: auto
            ? "quality:auto"
            : `quality:${engine.getCurrentRepresentationForType("video")?.id}`,
        },
      };
    },
    async (command) => {
      if (command.type === "goLive") {
        const s = adapter.getSnapshot(),
          edge = s.seekable.at(-1)?.end;
        return s.live && edge !== undefined
          ? base.execute({ type: "seek", time: edge })
          : failure("unsupported", "Transmissão sem janela navegável.");
      }
      if (command.type !== "selectTrack") return null;
      if (
        (command.kind === "captions" || command.kind === "subtitles") &&
        text().length === 0
      )
        return base.execute(command);
      if (!ready)
        return failure("unsupported", "A transmissão não está pronta.");
      if (
        (command.kind === "captions" || command.kind === "subtitles") &&
        command.id === null
      ) {
        engine.enableText(false);
        adapter.refresh();
        return { ok: true };
      }
      const track = adapter
        .getSnapshot()
        .tracks.find((t) => t.id === command.id && t.kind === command.kind);
      if (!track) return failure("unsupported", "Faixa indisponível.");
      if (track.kind === "audio") {
        engine.setCurrentTrack(audio()[Number(track.id.slice(6))]);
      } else if (track.kind === "subtitles") {
        engine.enableText(true);
        engine.setTextTrack(Number(track.id.slice(5)));
      } else if (track.kind === "quality") {
        const id = track.id.slice(8);
        auto = id === "auto";
        engine.updateSettings({
          streaming: { abr: { autoSwitchBitrate: { video: auto } } },
        });
        if (!auto) engine.setRepresentationForTypeById("video", id, true);
      }
      adapter.refresh();
      return { ok: true };
    },
    () => {
      engine.destroy();
      options.signal.removeEventListener("abort", adapter.destroy);
    },
  );
  const events = dash.MediaPlayer.events as unknown as Record<string, string>;
  engine.on(events.STREAM_INITIALIZED, () => {
    ready = true;
    adapter.refresh();
  });
  for (const key of [
    "PLAYBACK_TIME_UPDATED",
    "PERIOD_SWITCH_COMPLETED",
    "TRACK_CHANGE_RENDERED",
    "QUALITY_CHANGE_RENDERED",
    "TEXT_TRACKS_ADDED",
  ])
    if (events[key]) engine.on(events[key], () => adapter.refresh());
  engine.on(events.ERROR, (event: unknown) =>
    base.patch({
      status: "error",
      error: {
        code: "network",
        message: "Não foi possível carregar a transmissão DASH.",
        recoverable: true,
        cause: event,
      },
    }),
  );
  options.signal.addEventListener("abort", adapter.destroy, { once: true });
  try {
    engine.initialize(base.media as HTMLVideoElement, src, false);
  } catch (error) {
    adapter.destroy();
    throw error;
  }
  return adapter;
};
