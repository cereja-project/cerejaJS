import {
  MediaRoot,
  MediaHost,
  TranscriptSearch,
} from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
import { autoAdapter } from "@cereja-project/ui-providers";
const cues = [
  { id: "one", start: 0, end: 5, text: "Um tom acompanha o padrão de teste." },
  { id: "two", start: 5, end: 12, text: "O padrão continua até o final." },
];
export function Example() {
  return (
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      adapterFactory={autoAdapter}
    >
      <MediaHost />
      <TranscriptSearch cues={cues} />
    </MediaRoot>
  );
}
