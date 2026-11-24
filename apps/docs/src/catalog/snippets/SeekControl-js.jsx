import { MediaRoot, MediaHost, SeekControl } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
import { autoAdapter } from "@cereja-project/ui-providers";
export function Example() {
  return (
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      adapterFactory={autoAdapter}
    >
      <MediaHost />
      <SeekControl />
    </MediaRoot>
  );
}
