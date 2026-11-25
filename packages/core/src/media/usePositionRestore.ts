import { useEffect, useRef, type MutableRefObject } from "react";
import type { MediaSnapshot, MediaCommand, CommandResult } from "./types";
export interface PositionRestoreRequest {
  time: number;
  playing: boolean;
  targetKey?: string;
}
export function usePositionRestore({
  requestRef,
  snapshot: s,
  execute,
  timeout,
  onUnavailable,
  sourceKey,
}: {
  requestRef: MutableRefObject<PositionRestoreRequest | null>;
  snapshot: MediaSnapshot;
  execute: (command: MediaCommand) => Promise<CommandResult>;
  timeout: number;
  onUnavailable: () => void;
  sourceKey?: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function clear() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }
  useEffect(() => () => clear(), []);
  useEffect(() => {
    const request = requestRef.current;
    if (
      !request ||
      (request.targetKey !== undefined && request.targetKey !== sourceKey) ||
      s.status === "loading"
    )
      return;
    if (s.status === "error") {
      requestRef.current = null;
      clear();
      return;
    }
    if (s.capabilities.seek && s.seekable.length) {
      requestRef.current = null;
      clear();
      void (async () => {
        const result = await execute({ type: "seek", time: request.time });
        if (!result.ok) {
          onUnavailable();
          return;
        }
        if (request.playing) await execute({ type: "play" });
      })();
    } else if (s.live) {
      requestRef.current = null;
      clear();
      onUnavailable();
      if (request.playing) void execute({ type: "play" });
    } else if (timer.current === null) {
      timer.current = setTimeout(() => {
        timer.current = null;
        if (requestRef.current !== request) return;
        requestRef.current = null;
        onUnavailable();
        if (request.playing) void execute({ type: "play" });
      }, timeout);
    }
  }, [s, execute, requestRef, timeout, onUnavailable, sourceKey]);
}
