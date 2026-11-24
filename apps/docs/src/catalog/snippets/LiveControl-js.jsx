import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="Ao vivo"
      source={{ type: "hls", src: "/live-fixture/stream.m3u8?session=example" }}
    />
  );
}
