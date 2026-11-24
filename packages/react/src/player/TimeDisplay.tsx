import { useMedia, useMediaConfig } from "@cereja-project/ui-core";
import { formatTime } from "./format";
export function TimeDisplay() {
  const { snapshot: s } = useMedia(),
    { labels } = useMediaConfig();
  return (
    <span className="md-time">
      {formatTime(s.currentTime)}{" "}
      {s.duration !== null ? `${labels.of} ${formatTime(s.duration)}` : ""}{" "}
      {s.live ? labels.live : ""}
    </span>
  );
}
