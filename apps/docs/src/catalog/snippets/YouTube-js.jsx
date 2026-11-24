import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <VideoPlayer
      label="YouTube"
      source={{ type: "youtube", id: "M7lc1UVf-VE" }}
      loadStrategy="on-interaction"
    />
  );
}
