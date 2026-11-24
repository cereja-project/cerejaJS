import type { MediaSnapshot } from "./types";
export function normalizeMediaSnapshot(input: MediaSnapshot): MediaSnapshot {
  const finite = (value: number, fallback: number) =>
    Number.isFinite(value) ? value : fallback;
  const seekable = input.seekable
    .filter(
      (r) =>
        Number.isFinite(r.start) &&
        Number.isFinite(r.end) &&
        r.start >= 0 &&
        r.end > r.start,
    )
    .map((r) => ({ ...r }))
    .sort((a, b) => a.start - b.start);
  return {
    ...input,
    paused:
      typeof input.paused === "boolean"
        ? input.paused
        : !["playing", "buffering"].includes(input.status),
    currentTime: Math.max(0, finite(input.currentTime, 0)),
    duration:
      input.duration !== null &&
      Number.isFinite(input.duration) &&
      input.duration >= 0
        ? input.duration
        : null,
    volume: Math.max(0, Math.min(1, finite(input.volume, 1))),
    playbackRate:
      Number.isFinite(input.playbackRate) && input.playbackRate > 0
        ? input.playbackRate
        : 1,
    availablePlaybackRates: input.availablePlaybackRates?.filter(
      (rate) => Number.isFinite(rate) && rate > 0,
    ),
    seekable,
    capabilities: {
      ...input.capabilities,
      seek: input.capabilities.seek && seekable.length > 0,
    },
  };
}
