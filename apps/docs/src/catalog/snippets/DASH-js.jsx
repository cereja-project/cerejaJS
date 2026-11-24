import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="DASH"
      source={{ type: "dash", src: "/fixtures/streams/dash/stream.mpd" }}
      loadStrategy="on-interaction"
    />
  );
}
