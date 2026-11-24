import { useState } from "react";
import { Button, ImageViewer } from "@cereja-project/ui-react";
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
export function Example() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <Button onClick={() => setActive(images[0].id)}>
        Abrir visualizador
      </Button>
      <ImageViewer
        items={images}
        activeId={active}
        onActiveChange={setActive}
      />
    </>
  );
}
