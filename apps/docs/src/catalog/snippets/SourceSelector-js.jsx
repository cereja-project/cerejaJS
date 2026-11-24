import { useState } from "react";
import { SourceSelector } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
const sources = [
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
    <SourceSelector sources={sources} value={value} onValueChange={setValue} />
  );
}
