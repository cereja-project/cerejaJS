import { useState } from "react";
import { MediaList } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
const images = [
  {
    id: "one",
    src: "/illustrations/mountains.svg",
    alt: "Duas montanhas com neve nos picos.",
    caption: "Montanhas",
  },
  {
    id: "two",
    src: "/illustrations/coast.svg",
    alt: "Barco perto da praia.",
    caption: "Litoral",
  },
];
const items = images.map((image, i) => ({
  id: String(i),
  title: image.caption,
  image,
}));
export function Example() {
  const [selected, setSelected] = useState([]);
  return (
    <MediaList
      items={items}
      selectedIds={selected}
      onSelectionChange={setSelected}
    />
  );
}
