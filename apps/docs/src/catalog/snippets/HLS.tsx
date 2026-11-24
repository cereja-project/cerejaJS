import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="HLS"
      source={{ type: "hls", src: "/fixtures/streams/hls/stream.m3u8" }}
      loadStrategy="on-interaction"
    />
  );
}
