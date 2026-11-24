import { Gallery } from "@cereja-project/ui-react";
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
  return <Gallery items={images} />;
}
