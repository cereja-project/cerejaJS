import { AudioPlayer } from "@cereja-project/ui-react";
export function AudioExampleJS() {
  return (
    <AudioPlayer
      label="Áudio de demonstração"
      source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
    />
  );
}
