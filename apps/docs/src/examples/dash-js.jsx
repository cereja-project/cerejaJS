import { VideoPlayer } from "@cereja-project/ui-react";
export function DashExample() {
  return (
    <VideoPlayer
      label="DASH — arquivo segmentado"
      source={{ type: "dash", src: "/fixtures/streams/dash/stream.mpd" }}
    />
  );
}
