import type {
  MediaAdapter,
  MediaSnapshot,
  CommandResult,
  MediaCommand,
} from "../../packages/core/src";
export function controlledAdapter(time = 0) {
  let snapshot: MediaSnapshot = {
    status: "ready",
    paused: true,
    currentTime: time,
    duration: 100,
    volume: 1,
    muted: false,
    playbackRate: 1,
    live: false,
    seekable: [{ start: 0, end: 100 }],
    capabilities: {
      seek: true,
      volume: true,
      rate: true,
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
  const listeners = new Set<() => void>();
  const commands: MediaCommand[] = [];
  let destroyed = 0;
  const adapter: MediaAdapter = {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    async execute(command): Promise<CommandResult> {
      commands.push(command);
      return { ok: true };
    },
    destroy() {
      destroyed++;
      listeners.clear();
    },
  };
  return {
    adapter,
    commands,
    get destroyed() {
      return destroyed;
    },
    get listeners() {
      return listeners.size;
    },
    update(patch: Partial<MediaSnapshot>) {
      if (patch.paused === undefined) {
        if (patch.status === "playing") patch = { ...patch, paused: false };
        else if (
          patch.status === "paused" ||
          patch.status === "ended" ||
          patch.status === "ready"
        )
          patch = { ...patch, paused: true };
      }
      snapshot = { ...snapshot, ...patch };
      listeners.forEach((fn) => fn());
    },
  };
}
