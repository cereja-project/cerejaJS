import { useEffect, useRef, useState } from "react";
import {
  MediaHost,
  Status,
  attachTextTracks,
  useMediaConfig,
  type TextTrackInput,
} from "@cereja-project/ui-core";
const emptyTracks: TextTrackInput[] = [];
export function MediaViewport({
  label,
  poster,
  tracks = emptyTracks,
}: {
  label: string;
  poster?: string;
  tracks?: TextTrackInput[];
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { labels } = useMediaConfig();
  useEffect(() => {
    const host =
      wrapper.current?.querySelector<HTMLElement>("[data-media-host]");
    if (!host) return;
    let media: HTMLMediaElement | null = null,
      remove: undefined | (() => void);
    const errors: Array<() => void> = [];
    function sync() {
      const next = host!.querySelector<HTMLMediaElement>("video,audio");
      if (next === media) return;
      remove?.();
      media = next;
      setFailed(false);
      if (!media) return;
      try {
        remove = attachTextTracks(media, tracks);
        media.querySelectorAll("track").forEach((track) => {
          const error = () => setFailed(true);
          track.addEventListener("error", error);
          errors.push(() => track.removeEventListener("error", error));
        });
      } catch {
        setFailed(true);
      }
    }
    const observer = new MutationObserver(sync);
    observer.observe(host, { childList: true });
    sync();
    return () => {
      observer.disconnect();
      remove?.();
      errors.forEach((fn) => fn());
    };
  }, [tracks]);
  return (
    <div ref={wrapper}>
      <MediaHost
        data-media-host
        className="md-media-host"
        data-label={label}
        data-poster={poster}
      />
      {failed && <Status error>{labels.network}</Status>}
    </div>
  );
}
