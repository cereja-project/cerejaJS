import type { PositionRestoreRequest } from "./usePositionRestore";
import type { ReactNode, MutableRefObject } from "react";

export type MediaSource =
  | { type: "file" | "hls" | "dash"; src: string; mimeType?: string }
  | {
      type: "youtube" | "vimeo";
      id: string;
      embedUrl?: string;
      live?: boolean;
    };
export interface MediaError {
  code:
    | "unsupported"
    | "network"
    | "blocked"
    | "invalid-source"
    | "provider"
    | "aborted";
  message: string;
  recoverable: boolean;
  cause?: unknown;
}
export type CommandResult = { ok: true } | { ok: false; error: MediaError };
export interface TrackInfo {
  id: string;
  label: string;
  language?: string;
  kind: "captions" | "subtitles" | "audio" | "quality";
}
export interface Capabilities {
  seek: boolean;
  volume: boolean;
  rate: boolean;
  captions: boolean;
  audioTracks: boolean;
  quality: boolean;
  fullscreen: boolean;
  pictureInPicture: boolean;
}
export interface MediaSnapshot {
  status:
    | "loading"
    | "ready"
    | "playing"
    | "paused"
    | "buffering"
    | "ended"
    | "error";
  paused: boolean;
  currentTime: number;
  duration: number | null;
  volume: number;
  muted: boolean;
  playbackRate: number;
  availablePlaybackRates?: number[];
  live: boolean;
  seekable: Array<{ start: number; end: number }>;
  capabilities: Capabilities;
  tracks: TrackInfo[];
  selectedTrackIds: Partial<Record<TrackInfo["kind"], string>>;
  error: MediaError | null;
}
export type MediaCommand =
  | { type: "play" | "pause" | "goLive" }
  | { type: "seek"; time: number }
  | { type: "volume" | "rate"; value: number }
  | { type: "mute" | "fullscreen" | "pictureInPicture"; value: boolean }
  | { type: "selectTrack"; kind: TrackInfo["kind"]; id: string | null };
export interface MediaAdapter {
  getSnapshot(): MediaSnapshot;
  subscribe(listener: () => void): () => void;
  execute(command: MediaCommand): Promise<CommandResult>;
  destroy(): void;
}
export interface AdapterLabels {
  automatic: string;
  track: string;
}
export type AdapterFactory = (options: {
  source: MediaSource;
  host: HTMLElement;
  kind: "audio" | "video";
  signal: AbortSignal;
  labels?: Partial<AdapterLabels>;
}) => Promise<MediaAdapter>;
export interface MediaRootProps {
  source: MediaSource;
  kind: "audio" | "video";
  adapterFactory: AdapterFactory;
  children: ReactNode;
  onError?: (error: MediaError) => void;
}
export interface TextTrackInput {
  id: string;
  src: string;
  language: string;
  label: string;
  kind: "captions" | "subtitles";
  default?: boolean;
}
export interface TranscriptCue {
  id: string;
  start: number;
  end: number;
  text: string;
}
export interface Chapter {
  id: string;
  start: number;
  title: string;
}
export interface PlayerProps {
  children?: ReactNode;
  positionRestoreRef?: MutableRefObject<PositionRestoreRequest | null>;
  onSnapshot?: (snapshot: MediaSnapshot) => void;
  source: MediaSource;
  label: string;
  poster?: string;
  tracks?: TextTrackInput[];
  transcript?: TranscriptCue[];
  chapters?: Chapter[];
  describedSource?: MediaSource;
  describedTracks?: TextTrackInput[];
  loadStrategy?: "immediate" | "on-interaction";
  shortcuts?: boolean;
  onError?: (error: MediaError) => void;
}
