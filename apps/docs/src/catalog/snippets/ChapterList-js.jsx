import { MediaRoot, MediaHost, ChapterList } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
import { autoAdapter } from "@cereja-project/ui-providers";
const chapters = [
  { id: "one", start: 0, title: "Início" },
  { id: "two", start: 5, title: "Segundo trecho" },
];
export function Example() {
  return (
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      adapterFactory={autoAdapter}
    >
      <MediaHost />
      <ChapterList chapters={chapters} />
    </MediaRoot>
  );
}
