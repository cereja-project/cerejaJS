import { VideoPlayer } from "@cereja-project/ui-react";
import { media, tracks, cues, chapters } from "./data";
export function VideoExample() {
  return (
    <VideoPlayer
      label="Vídeo com legendas e transcrição"
      poster="/illustrations/mountains.svg"
      source={{ type: "file", src: media }}
      tracks={tracks}
      transcript={cues}
      chapters={chapters}
    />
  );
}
