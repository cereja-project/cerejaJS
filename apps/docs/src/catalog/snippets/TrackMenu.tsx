import { TextTrackInput, VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
const tracks: TextTrackInput[] = [
  {
    id: "pt",
    src: "/fixtures/tracks/sample.vtt",
    language: "pt-BR",
    label: "Português",
    kind: "captions",
  },
];
export function Example() {
  return (
    <VideoPlayer
      label="Vídeo com legendas"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      tracks={tracks}
    />
  );
}
