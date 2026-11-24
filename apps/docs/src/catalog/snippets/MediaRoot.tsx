import { MediaRoot, MediaHost, PlayerControls } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
import { autoAdapter } from "@cereja-project/ui-providers";
export function Example() {
  return (
    <MediaRoot
      kind="audio"
      source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
      adapterFactory={autoAdapter}
    >
      <MediaHost />
      <PlayerControls />
    </MediaRoot>
  );
}
