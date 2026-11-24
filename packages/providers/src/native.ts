import {
  initialSnapshot,
  normalizeMediaSnapshot,
  type AdapterFactory,
  type MediaAdapter,
  type MediaSnapshot,
  type MediaCommand,
  type CommandResult,
} from "@cereja-project/ui-core";
import { failure, commandError, safeMediaUrl } from "./errors";
export interface NativeController extends MediaAdapter {
  media: HTMLMediaElement;
  patch(update: Partial<MediaSnapshot>): void;
  refresh(): void;
}
export function clampToRanges(
  time: number,
  ranges: MediaSnapshot["seekable"],
): number | null {
  if (!Number.isFinite(time) || !ranges.length) return null;
  let target = ranges[0].start,
    distance = Infinity;
  for (const range of ranges) {
    if (time >= range.start && time <= range.end) return time;
    for (const bound of [range.start, range.end]) {
      const next = Math.abs(time - bound);
      if (next < distance) {
        target = bound;
        distance = next;
      }
    }
  }
  return target;
}
export function createNativeController({
  host,
  kind,
  signal,
  labels,
}: Parameters<AdapterFactory>[0]): NativeController {
  const media = document.createElement(kind);
  media.preload = "metadata";
  media.autoplay = false;
  if (media instanceof HTMLVideoElement) {
    media.playsInline = true;
    if (host.dataset.poster) media.poster = host.dataset.poster;
  }
  if (host.dataset.label) media.setAttribute("aria-label", host.dataset.label);
  host.append(media);
  let snapshot = initialSnapshot(),
    destroyed = false;
  const listeners = new Set<() => void>();
  const cleanup: Array<() => void> = [];
  function patch(update: Partial<MediaSnapshot>) {
    if (destroyed) return;
    snapshot = normalizeMediaSnapshot({ ...snapshot, ...update });
    listeners.forEach((fn) => fn());
  }
  function ranges() {
    const values = [];
    for (let i = 0; i < media.seekable.length; i++)
      values.push({
        start: media.seekable.start(i),
        end: media.seekable.end(i),
      });
    return values;
  }
  function refresh() {
    const duration =
      Number.isFinite(media.duration) && media.duration >= 0
        ? media.duration
        : null;
    const seekable = ranges();
    const textTracks = Array.from(media.textTracks ?? []);
    const tracks = textTracks
      .filter((t) => t.kind === "captions" || t.kind === "subtitles")
      .map((t, i) => ({
        id: t.id || String(i),
        label: t.label || t.language || `${labels?.track ?? "Faixa"} ${i + 1}`,
        language: t.language,
        kind: t.kind as "captions" | "subtitles",
      }));
    const selected: MediaSnapshot["selectedTrackIds"] = {
      ...snapshot.selectedTrackIds,
    };
    delete selected.captions;
    delete selected.subtitles;
    textTracks.forEach((t, i) => {
      if (
        t.mode === "showing" &&
        (t.kind === "captions" || t.kind === "subtitles")
      )
        selected[t.kind] = t.id || String(i);
    });
    patch({
      duration,
      paused: media.paused,
      currentTime: Number.isFinite(media.currentTime) ? media.currentTime : 0,
      volume: media.volume,
      muted: media.muted,
      playbackRate: media.playbackRate,
      seekable,
      tracks,
      selectedTrackIds: selected,
      capabilities: {
        ...snapshot.capabilities,
        seek: seekable.length > 0,
        volume: true,
        rate: true,
        captions: tracks.length > 0,
        fullscreen: typeof host.requestFullscreen === "function",
        pictureInPicture:
          kind === "video" &&
          !!document.pictureInPictureEnabled &&
          typeof (media as HTMLVideoElement).requestPictureInPicture ===
            "function",
      },
    });
  }
  function on(target: EventTarget, event: string, fn: EventListener) {
    target.addEventListener(event, fn);
    cleanup.push(() => target.removeEventListener(event, fn));
  }
  for (const event of [
    "loadedmetadata",
    "durationchange",
    "timeupdate",
    "progress",
    "volumechange",
    "ratechange",
    "loadeddata",
  ])
    on(media, event, () => {
      refresh();
      if (event === "loadedmetadata" && snapshot.status === "loading")
        patch({ status: "ready" });
    });
  for (const [event, status] of Object.entries({
    playing: "playing",
    pause: "paused",
    waiting: "buffering",
    ended: "ended",
  } as const))
    on(media, event, () =>
      patch({
        status,
        paused: media.paused,
        ...(status === "playing" ? { error: null } : {}),
      }),
    );
  on(media, "error", () =>
    patch({
      status: "error",
      error: {
        code: media.error?.code === 4 ? "unsupported" : "network",
        message:
          "A mídia não pôde ser reproduzida. Verifique o formato e a conexão.",
        recoverable: true,
      },
    }),
  );
  if (typeof media.textTracks?.addEventListener === "function") {
    on(media.textTracks, "addtrack", refresh);
    on(media.textTracks, "removetrack", refresh);
    on(media.textTracks, "change", refresh);
  }
  const controller: NativeController = {
    media,
    patch,
    refresh,
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    async execute(command: MediaCommand): Promise<CommandResult> {
      if (destroyed) return failure("aborted", "Operação cancelada.");
      try {
        switch (command.type) {
          case "play":
            await media.play();
            break;
          case "pause":
            media.pause();
            break;
          case "seek": {
            const target = clampToRanges(command.time, snapshot.seekable);
            if (target === null)
              return failure(
                "unsupported",
                "Não é possível navegar nesta mídia.",
              );
            media.currentTime = target;
            break;
          }
          case "goLive": {
            if (!snapshot.live || !snapshot.seekable.length)
              return failure(
                "unsupported",
                "A transmissão não permite navegar.",
              );
            media.currentTime = snapshot.seekable.at(-1)!.end;
            break;
          }
          case "volume":
            if (
              !snapshot.capabilities.volume ||
              !Number.isFinite(command.value)
            )
              return failure("unsupported", "Volume indisponível.");
            media.volume = Math.max(0, Math.min(1, command.value));
            break;
          case "mute":
            media.muted = command.value;
            break;
          case "rate":
            if (!Number.isFinite(command.value) || command.value <= 0)
              return failure("unsupported", "Velocidade inválida.");
            media.playbackRate = command.value;
            break;
          case "fullscreen":
            if (command.value) {
              const target =
                host.closest<HTMLElement>("[data-media-player]") ?? host;
              if (!target.requestFullscreen)
                return failure("unsupported", "Tela cheia indisponível.");
              await target.requestFullscreen();
            } else if (document.fullscreenElement)
              await document.exitFullscreen();
            break;
          case "pictureInPicture":
            if (command.value) {
              if (!snapshot.capabilities.pictureInPicture)
                return failure(
                  "unsupported",
                  "Picture-in-picture indisponível.",
                );
              await (media as HTMLVideoElement).requestPictureInPicture();
            } else if (document.pictureInPictureElement)
              await document.exitPictureInPicture();
            break;
          case "selectTrack": {
            if (command.kind !== "captions" && command.kind !== "subtitles")
              return failure("unsupported", "Faixa indisponível.");
            const tracks = Array.from(media.textTracks);
            if (
              command.id !== null &&
              !tracks.some((t, i) => (t.id || String(i)) === command.id)
            )
              return failure("unsupported", "Faixa indisponível.");
            tracks.forEach((track, i) => {
              if (track.kind === "captions" || track.kind === "subtitles")
                track.mode =
                  command.id !== null && (track.id || String(i)) === command.id
                    ? "showing"
                    : "disabled";
            });
            refresh();
            break;
          }
        }
        return destroyed
          ? failure("aborted", "Operação cancelada.")
          : { ok: true };
      } catch (cause) {
        return commandError(cause);
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cleanup.forEach((fn) => fn());
      listeners.clear();
      media.pause();
      media.removeAttribute("src");
      media.load();
      media.remove();
      signal.removeEventListener("abort", controller.destroy);
    },
  };
  signal.addEventListener("abort", controller.destroy, { once: true });
  if (signal.aborted) controller.destroy();
  return controller;
}
export const createNativeAdapter: AdapterFactory = async (options) => {
  if (options.source.type !== "file")
    throw new Error("Esperada uma fonte file.");
  const src = safeMediaUrl(options.source.src);
  const adapter = createNativeController(options);
  if (!options.signal.aborted) {
    adapter.media.src = src;
    adapter.refresh();
  }
  return adapter;
};
