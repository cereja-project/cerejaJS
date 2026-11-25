import { CompactAudioPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <CompactAudioPlayer
      label="Minha mídia"
      source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
    />
  );
}
