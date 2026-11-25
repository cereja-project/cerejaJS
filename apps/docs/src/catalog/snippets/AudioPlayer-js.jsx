import { AudioPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <AudioPlayer
      label="Minha mídia"
      source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
    />
  );
}
