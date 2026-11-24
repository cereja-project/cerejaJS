import type {
  AdapterFactory,
  CommandResult,
  MediaAdapter,
  MediaCommand,
  MediaSnapshot,
  MediaSource,
  MediaError,
} from "./types";

import { normalizeMediaSnapshot } from "./normalize";
export function initialSnapshot(): MediaSnapshot {
  return {
    status: "loading",
    paused: true,
    currentTime: 0,
    duration: null,
    volume: 1,
    muted: false,
    playbackRate: 1,
    live: false,
    seekable: [],
    capabilities: {
      seek: false,
      volume: false,
      rate: false,
      captions: false,
      audioTracks: false,
      quality: false,
      fullscreen: false,
      pictureInPicture: false,
    },
    tracks: [],
    selectedTrackIds: {},
    error: null,
  };
}
export const serverSnapshot = initialSnapshot();
const aborted = (): CommandResult => ({
  ok: false,
  error: {
    code: "aborted",
    message: "Operação cancelada.",
    recoverable: false,
  },
});
export function createMediaStore() {
  let snapshot = initialSnapshot(),
    adapter: MediaAdapter | undefined,
    abort: AbortController | undefined,
    unsubscribe: (() => void) | undefined,
    generation = 0;
  let actionError: MediaError | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((fn) => fn());
  function detach() {
    generation++;
    abort?.abort();
    unsubscribe?.();
    unsubscribe = undefined;
    adapter?.destroy();
    adapter = undefined;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    async attach(
      host: HTMLElement,
      source: MediaSource,
      kind: "audio" | "video",
      factory: AdapterFactory,
      labels?: Parameters<AdapterFactory>[0]["labels"],
    ) {
      detach();
      const epoch = generation;
      abort = new AbortController();
      const signal = abort.signal;
      actionError = null;
      snapshot = initialSnapshot();
      emit();
      try {
        const next = await factory({ host, source, kind, signal, labels });
        if (epoch !== generation || signal.aborted) {
          next.destroy();
          return;
        }
        adapter = next;
        const update = () => {
          if (epoch === generation) {
            const nextSnapshot = normalizeMediaSnapshot(next.getSnapshot());
            snapshot = {
              ...nextSnapshot,
              error: nextSnapshot.error ?? actionError,
            };
            emit();
          }
        };
        unsubscribe = next.subscribe(update);
        update();
      } catch (cause) {
        if (epoch !== generation || signal.aborted) return;
        const error: MediaError = {
          code: "provider",
          message: "Não foi possível carregar a mídia.",
          recoverable: true,
          cause,
        };
        snapshot = { ...snapshot, status: "error", error };
        emit();
      }
    },
    async execute(command: MediaCommand): Promise<CommandResult> {
      const epoch = generation;
      if (!adapter) return aborted();
      try {
        const result = await adapter.execute(command);
        if (epoch !== generation) return aborted();
        actionError = result.ok ? null : result.error;
        if (!result.ok && result.error.code === "aborted") return result;
        snapshot = {
          ...snapshot,
          error: adapter?.getSnapshot().error ?? actionError,
        };
        emit();
        return result;
      } catch (cause) {
        if (epoch !== generation) return aborted();
        actionError = {
          code: "provider",
          message: "Não foi possível executar esta ação.",
          recoverable: true,
          cause,
        };
        snapshot = { ...snapshot, error: actionError };
        emit();
        return { ok: false, error: actionError };
      }
    },
    destroy() {
      detach();
      snapshot = initialSnapshot();
    },
  };
}
export type MediaStore = ReturnType<typeof createMediaStore>;
