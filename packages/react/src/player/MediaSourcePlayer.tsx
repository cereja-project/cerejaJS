import { useRef } from "react";
import {
  EmptyState,
  useMediaConfig,
  type PlayerProps,
  type PositionRestoreRequest,
  type MediaSnapshot,
  type AdapterFactory,
} from "@cereja-project/ui-core";
import { VideoPlayer } from "./VideoPlayer";
import { SourceSelector, type SourceOption } from "./SourceSelector";
export interface MediaSourcePlayerProps extends Omit<
  PlayerProps,
  "source" | "positionRestoreRef"
> {
  sources: SourceOption[];
  value: string;
  onValueChange: (id: string) => void;
  adapterFactory?: AdapterFactory;
}
export function MediaSourcePlayer({
  sources,
  value,
  onValueChange,
  onSnapshot,
  ...props
}: MediaSourcePlayerProps) {
  const { labels } = useMediaConfig(),
    request = useRef<PositionRestoreRequest | null>(null),
    last = useRef<MediaSnapshot | null>(null);
  const active = sources.find((s) => s.id === value) ?? sources[0];
  if (!active) return <EmptyState title={labels.emptyMedia} />;
  return (
    <div className="md-source-player">
      <SourceSelector
        sources={sources}
        value={active.id}
        onValueChange={(id) => {
          const next = sources.find((s) => s.id === id);
          if (!next || next.id === active.id) return;
          request.current = {
            time: last.current?.currentTime ?? 0,
            playing: last.current ? !last.current.paused : false,
            targetKey: JSON.stringify(next.source),
          };
          onValueChange(id);
        }}
      />
      <VideoPlayer
        {...props}
        source={active.source}
        positionRestoreRef={request}
        onSnapshot={(snapshot) => {
          last.current = snapshot;
          onSnapshot?.(snapshot);
        }}
      />
    </div>
  );
}
