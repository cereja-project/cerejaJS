import { VideoPlayer } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
const chapters = [
  { id: "one", start: 0, title: "Início" },
  { id: "two", start: 5, title: "Segundo trecho" },
];
export function Example() {
  return (
    <VideoPlayer
      label="Capítulos"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      chapters={chapters}
    />
  );
}
