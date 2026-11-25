import {
  initialSnapshot,
  normalizeMediaSnapshot,
  type AdapterFactory,
  type MediaAdapter,
  type MediaSnapshot,
  type TrackInfo,
  type CommandResult,
} from "@cereja-project/ui-core";
import type VimeoPlayer from "@vimeo/player";
import { getEmbedUrl } from "./embed-url";
import { waitForSdk } from "./sdk-loader";
import { failure, commandError } from "./errors";
import { providerDefaults, type ProviderSettings } from "./config";
interface AudioTrack {
  language: string;
  kind: string;
  label: string;
  enabled: boolean;
}
type ExtendedVimeo = VimeoPlayer & {
  getAudioTracks?: () => Promise<AudioTrack[]>;
  selectAudioTrack?: (language: string, kind?: string) => Promise<AudioTrack>;
};
export const createVimeoAdapter = async (
  options: Parameters<AdapterFactory>[0] & { settings?: ProviderSettings },
): Promise<MediaAdapter> => {
  if (options.source.type !== "vimeo") throw new Error("Esperada fonte Vimeo.");
  const source = options.source,
    url = getEmbedUrl(source),
    settings = { ...providerDefaults, ...options.settings };
  const { default: Player } = await import("@vimeo/player");
  if (options.signal.aborted) throw new DOMException("Aborted", "AbortError");
  url.searchParams.set("autoplay", "0");
  url.searchParams.set("controls", "1");
  url.searchParams.set("playsinline", "1");
  const iframe = document.createElement("iframe");
  iframe.src = url.href;
  iframe.title = options.host.dataset.label || "Vídeo do Vimeo";
  iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  options.host.append(iframe);
  let player: ExtendedVimeo;
  try {
    player = new Player(iframe) as ExtendedVimeo;
  } catch (error) {
    iframe.remove();
    throw error;
  }
  let snapshot = initialSnapshot(),
    destroyed = false,
    playing = false;
  const listeners = new Set<() => void>(),
    cleanup: Array<() => void> = [];
  const emit = (patch: Partial<MediaSnapshot>) => {
    if (!destroyed) {
      snapshot = normalizeMediaSnapshot({ ...snapshot, ...patch });
      listeners.forEach((fn) => fn());
    }
  };
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cleanup.forEach((fn) => fn());
    listeners.clear();
    options.signal.removeEventListener("abort", destroy);
    void player.destroy().catch(() => {});
    iframe.remove();
  }
  options.signal.addEventListener("abort", destroy, { once: true });
  let text: Awaited<ReturnType<VimeoPlayer["getTextTracks"]>> = [],
    audio: AudioTrack[] = [],
    quality: Awaited<ReturnType<VimeoPlayer["getQualities"]>> = [];
  try {
    await waitForSdk(player.ready(), options.signal, settings.readyTimeout);
    const values = await waitForSdk(
      Promise.allSettled([
        player.getDuration(),
        player.getCurrentTime(),
        player.getVolume(),
        player.getMuted(),
        player.getPlaybackRate(),
        player.getPaused(),
        player.getTextTracks(),
        player.getQualities(),
        player.getAudioTracks?.() ?? Promise.resolve([]),
        player.getQuality(),
      ]),
      options.signal,
      settings.readyTimeout,
    );
    const value = <T>(index: number, fallback: T): T =>
      values[index].status === "fulfilled"
        ? (values[index].value as T)
        : fallback;
    const duration = value(0, 0);
    text = value(6, []);
    quality = value(7, []);
    audio = value(8, []);
    playing = !value(5, true);
    const tracks: TrackInfo[] = [
      ...text
        .filter((t) => t.kind === "captions" || t.kind === "subtitles")
        .map((t) => ({
          id: `${t.kind}:${t.language}`,
          label: t.label || t.language,
          language: t.language,
          kind: t.kind as "captions" | "subtitles",
        })),
      ...audio.map((t, i) => ({
        id: `audio:${i}`,
        label: t.label || t.language,
        language: t.language,
        kind: "audio" as const,
      })),
      ...quality.map((q) => ({
        id: `quality:${q.id}`,
        kind: "quality" as const,
        label: q.label || q.id,
      })),
    ];
    emit({
      status: playing ? "playing" : "paused",
      paused: !playing,
      currentTime: value(1, 0),
      duration: Number.isFinite(duration) && duration > 0 ? duration : null,
      volume: value(2, 1),
      muted: value(3, false),
      playbackRate: value(4, 1),
      live: !!source.live,
      seekable:
        !source.live && duration > 0 ? [{ start: 0, end: duration }] : [],
      tracks,
      capabilities: {
        ...snapshot.capabilities,
        seek: !source.live && duration > 0,
        volume: values[2].status === "fulfilled",
        rate: false,
        captions: text.length > 0,
        audioTracks:
          audio.length > 0 && typeof player.selectAudioTrack === "function",
        quality: quality.length > 1,
      },
      selectedTrackIds: {
        quality: `quality:${value(9, "auto")}`,
        audio: audio.some((t) => t.enabled)
          ? `audio:${audio.findIndex((t) => t.enabled)}`
          : undefined,
        ...Object.fromEntries(
          text
            .filter((t) => t.mode === "showing")
            .map((t) => [t.kind, `${t.kind}:${t.language}`]),
        ),
      },
    });
  } catch (error) {
    destroy();
    throw error;
  }
  function on<T>(
    event: Parameters<VimeoPlayer["on"]>[0],
    fn: (data: T) => void,
  ) {
    const wrapped = (data: unknown) => fn(data as T);
    player.on(event, wrapped);
    cleanup.push(() => player.off(event, wrapped));
  }
  on("play", () => {
    playing = true;
    emit({ status: "playing", paused: false, error: null });
  });
  on("pause", () => {
    playing = false;
    emit({ status: "paused", paused: true });
  });
  on("ended", () => {
    playing = false;
    emit({ status: "ended", paused: true });
  });
  on("bufferstart", () => emit({ status: "buffering" }));
  on("bufferend", () => emit({ status: playing ? "playing" : "paused" }));
  on<{ seconds: number; duration: number }>("timeupdate", (data) =>
    emit({
      currentTime: Number.isFinite(data.seconds) ? data.seconds : 0,
      duration:
        Number.isFinite(data.duration) && data.duration > 0
          ? data.duration
          : null,
      capabilities: {
        ...snapshot.capabilities,
        seek:
          !source.live && Number.isFinite(data.duration) && data.duration > 0,
      },
      seekable:
        !source.live && data.duration > 0
          ? [{ start: 0, end: data.duration }]
          : [],
    }),
  );
  on<{ volume: number }>("volumechange", (data) => {
    emit({ volume: data.volume });
    void player
      .getMuted()
      .then((muted) => emit({ muted }))
      .catch(() => {});
  });
  on<{ playbackRate: number }>("playbackratechange", (data) =>
    emit({ playbackRate: data.playbackRate }),
  );
  on<{ language?: string; kind?: "captions" | "subtitles" }>(
    "texttrackchange",
    (data) => {
      const selected = { ...snapshot.selectedTrackIds };
      delete selected.captions;
      delete selected.subtitles;
      if (data.kind && data.language)
        selected[data.kind] = `${data.kind}:${data.language}`;
      emit({ selectedTrackIds: selected });
    },
  );
  on<{ id: string }>("qualitychange", (data) =>
    emit({
      selectedTrackIds: {
        ...snapshot.selectedTrackIds,
        quality: `quality:${data.id}`,
      },
    }),
  );
  on<{ message?: string; name?: string }>("error", (data) =>
    emit({
      status: "error",
      error: {
        code: ["PasswordError", "PrivacyError"].includes(data.name ?? "")
          ? "blocked"
          : "provider",
        message: data.message || "Não foi possível carregar o vídeo do Vimeo.",
        recoverable: true,
      },
    }),
  );
  return {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    destroy,
    async execute(command): Promise<CommandResult> {
      if (destroyed) return failure("aborted", "Operação cancelada.");
      try {
        switch (command.type) {
          case "play":
            await player.play();
            break;
          case "pause":
            await player.pause();
            break;
          case "seek":
            if (!snapshot.capabilities.seek || !Number.isFinite(command.time))
              return failure("unsupported", "Navegação indisponível.");
            await player.setCurrentTime(
              Math.max(0, Math.min(snapshot.duration ?? 0, command.time)),
            );
            break;
          case "volume":
            if (!Number.isFinite(command.value))
              return failure("unsupported", "Volume inválido.");
            await player.setVolume(Math.max(0, Math.min(1, command.value)));
            break;
          case "mute":
            await player.setMuted(command.value);
            break;
          case "rate":
            return failure(
              "unsupported",
              "Use os controles do Vimeo para selecionar a velocidade.",
            );
          case "selectTrack": {
            if (
              (command.kind === "captions" || command.kind === "subtitles") &&
              command.id === null
            ) {
              await player.disableTextTrack();
              break;
            }
            const track = snapshot.tracks.find(
              (t) => t.id === command.id && t.kind === command.kind,
            );
            if (!track) return failure("unsupported", "Faixa indisponível.");
            if (track.kind === "audio") {
              const target = audio[Number(track.id.slice(6))];
              if (!player.selectAudioTrack || !target)
                return failure("unsupported", "Faixa indisponível.");
              await player.selectAudioTrack(target.language, target.kind);
              emit({
                selectedTrackIds: {
                  ...snapshot.selectedTrackIds,
                  audio: track.id,
                },
              });
            } else if (track.kind === "quality")
              await player.setQuality(
                track.id.slice(8) as Parameters<VimeoPlayer["setQuality"]>[0],
              );
            else await player.enableTextTrack(track.language!, track.kind);
            break;
          }
          default:
            return failure(
              "unsupported",
              "Use os controles do Vimeo para este recurso.",
            );
        }
        return destroyed
          ? failure("aborted", "Operação cancelada.")
          : { ok: true };
      } catch (error) {
        return commandError(error);
      }
    },
  };
};
