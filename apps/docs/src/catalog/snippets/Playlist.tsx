import { useState } from "react";
import { SourceOption, Playlist } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
const sources: SourceOption[] = [
  {
    id: "one",
    label: "Original",
    source: { type: "file", src: "/fixtures/media/sample.mp4" },
  },
  {
    id: "two",
    label: "Descrita",
    source: { type: "file", src: "/fixtures/media/described.mp4" },
  },
];
export function Example() {
  const [value, setValue] = useState("one");
  return (
    <Playlist
      items={sources.map((s) => ({
        id: s.id,
        title: s.label,
        source: s.source,
      }))}
      activeId={value}
      onSelect={setValue}
    />
  );
}
