import {
  initialSnapshot,
  normalizeMediaSnapshot,
  type AdapterFactory,
  type MediaAdapter,
  type MediaSnapshot,
  type CommandResult,
} from "@cereja-project/ui-core";
import { loadSdk } from "./sdk-loader";
import { getEmbedUrl } from "./embed-url";
import { failure, commandError } from "./errors";
import { providerDefaults, type ProviderSettings } from "./config";
type YouTubeWindow = Window & {
  YT?: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
};
function loadYouTubeSdk(
  timeout = providerDefaults.sdkTimeout,
): Promise<typeof YT> {
  return loadSdk(
    "youtube",
    () =>
      new Promise((resolve, reject) => {
        const w = window as YouTubeWindow;
        if (w.YT?.Player) {
          resolve(w.YT);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        const previous = w.onYouTubeIframeAPIReady;
        const cleanup = () => {
          clearTimeout(timer);
          script.onerror = null;
          if (w.onYouTubeIframeAPIReady === ready)
            w.onYouTubeIframeAPIReady = previous;
        };
        function ready() {
          try {
            previous?.();
          } finally {
            cleanup();
            if (w.YT?.Player) resolve(w.YT);
            else reject(new Error("API YouTube indisponível."));
          }
        }
        const timer = setTimeout(() => {
          cleanup();
          script.remove();
          reject(new Error("Tempo de carregamento do YouTube excedido."));
        }, timeout);
        script.onerror = () => {
          cleanup();
          script.remove();
          reject(new Error("Não foi possível carregar o YouTube."));
        };
        w.onYouTubeIframeAPIReady = ready;
        document.head.append(script);
      }),
  );
}
export const createYouTubeAdapter = async (
  options: Parameters<AdapterFactory>[0] & { settings?: ProviderSettings },
): Promise<MediaAdapter> => {
  if (options.source.type !== "youtube")
    throw new Error("Esperada fonte YouTube.");
  const source = options.source,
    url = getEmbedUrl(source),
    settings = { ...providerDefaults, ...options.settings };
  const sdk = await loadYouTubeSdk(settings.sdkTimeout);
  if (options.signal.aborted) throw new DOMException("Aborted", "AbortError");
  url.searchParams.set("enablejsapi", "1");
  url.searchParams.set("controls", "1");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("autoplay", "0");
  if (location.origin !== "null")
    url.searchParams.set("origin", location.origin);
  const iframe = document.createElement("iframe");
  iframe.src = url.href;
  iframe.title = options.host.dataset.label || "Vídeo do YouTube";
  iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  options.host.append(iframe);
  return new Promise((resolve, reject) => {
    let player: YT.Player | undefined,
      snapshot = initialSnapshot(),
      destroyed = false,
      ready = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const listeners = new Set<() => void>();
    const emit = (patch: Partial<MediaSnapshot>) => {
      if (destroyed) return;
      snapshot = normalizeMediaSnapshot({ ...snapshot, ...patch });
      listeners.forEach((fn) => fn());
    };
    function refresh() {
      if (!ready || !player || destroyed) return;
      try {
        const duration = player.getDuration(),
          state = player.getPlayerState();
        emit({
          currentTime: Math.max(0, player.getCurrentTime() || 0),
          duration: Number.isFinite(duration) && duration > 0 ? duration : null,
          volume: player.getVolume() / 100,
          muted: player.isMuted(),
          playbackRate: player.getPlaybackRate(),
          availablePlaybackRates: player.getAvailablePlaybackRates(),
          live: !!source.live,
          seekable:
            !source.live && duration > 0 ? [{ start: 0, end: duration }] : [],
          paused:
            state !== sdk.PlayerState.PLAYING &&
            state !== sdk.PlayerState.BUFFERING,
          error:
            state === sdk.PlayerState.PLAYING && snapshot.status !== "error"
              ? null
              : snapshot.error,
          status:
            snapshot.status === "error"
              ? "error"
              : state === sdk.PlayerState.PLAYING
                ? "playing"
                : state === sdk.PlayerState.BUFFERING
                  ? "buffering"
                  : state === sdk.PlayerState.ENDED
                    ? "ended"
                    : state === sdk.PlayerState.PAUSED
                      ? "paused"
                      : "ready",
          capabilities: {
            ...snapshot.capabilities,
            volume: true,
            rate: player.getAvailablePlaybackRates().length > 1,
            seek: !source.live && duration > 0,
          },
        });
      } catch {}
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(readyTimer);
      if (timer) clearInterval(timer);
      listeners.clear();
      options.signal.removeEventListener("abort", abort);
      try {
        player?.destroy();
      } finally {
        iframe.remove();
      }
    }
    function abort() {
      if (!ready) reject(new DOMException("Aborted", "AbortError"));
      destroy();
    }
    const readyTimer = setTimeout(() => {
      reject(new Error("O player YouTube não respondeu."));
      destroy();
    }, settings.readyTimeout);
    const adapter: MediaAdapter = {
      getSnapshot: () => snapshot,
      subscribe(fn) {
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      },
      destroy,
      async execute(command): Promise<CommandResult> {
        if (destroyed || !ready || !player)
          return failure("aborted", "Operação cancelada.");
        try {
          switch (command.type) {
            case "play":
              player.playVideo();
              break;
            case "pause":
              player.pauseVideo();
              break;
            case "seek":
              if (!snapshot.capabilities.seek || !Number.isFinite(command.time))
                return failure("unsupported", "Navegação indisponível.");
              player.seekTo(
                Math.max(0, Math.min(snapshot.duration ?? 0, command.time)),
                true,
              );
              break;
            case "volume":
              if (!Number.isFinite(command.value))
                return failure("unsupported", "Volume inválido.");
              player.setVolume(Math.max(0, Math.min(1, command.value)) * 100);
              break;
            case "mute":
              command.value ? player.mute() : player.unMute();
              break;
            case "rate":
              if (!player.getAvailablePlaybackRates().includes(command.value))
                return failure("unsupported", "Velocidade indisponível.");
              player.setPlaybackRate(command.value);
              break;
            default:
              return failure(
                "unsupported",
                "Use os controles do YouTube para este recurso.",
              );
          }
          refresh();
          return { ok: true };
        } catch (error) {
          return commandError(error);
        }
      },
    };
    options.signal.addEventListener("abort", abort, { once: true });
    try {
      player = new sdk.Player(iframe, {
        events: {
          onReady: () => {
            if (destroyed) return;
            ready = true;
            clearTimeout(readyTimer);
            refresh();
            timer = setInterval(refresh, settings.pollInterval);
            resolve(adapter);
          },
          onStateChange: refresh,
          onPlaybackRateChange: refresh,
          onAutoplayBlocked: () =>
            emit({
              error: {
                code: "blocked",
                message:
                  "A reprodução foi bloqueada pelo navegador. Use o player incorporado.",
                recoverable: true,
              },
            }),
          onError: (event) => {
            const code = [101, 150, 153].includes(event.data)
              ? "blocked"
              : event.data === 2 || event.data === 100
                ? "invalid-source"
                : "provider";
            if (!ready) {
              reject(new Error(`YouTube: ${event.data}`));
              destroy();
            } else
              emit({
                status: "error",
                error: {
                  code,
                  message: `Não foi possível reproduzir o vídeo do YouTube (${event.data}).`,
                  recoverable: true,
                },
              });
          },
        },
      });
    } catch (error) {
      reject(error);
      destroy();
    }
  });
};
