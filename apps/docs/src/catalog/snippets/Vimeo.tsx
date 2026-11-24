import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="Vimeo"
      source={{ type: "vimeo", id: "76979871" }}
      loadStrategy="on-interaction"
    />
  );
}
