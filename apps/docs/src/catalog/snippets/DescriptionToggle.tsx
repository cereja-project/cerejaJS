import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="Versão descrita"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      describedSource={{ type: "file", src: "/fixtures/media/described.mp4" }}
    />
  );
}
