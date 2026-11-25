import { useId } from "react";
import type { ImageData } from "@cereja-project/ui-core";
import { Image } from "./Image";
export function Figure({ image }: { image: ImageData }) {
  const id = useId();
  return (
    <figure
      className="md-figure"
      aria-describedby={image.description ? id : undefined}
    >
      <Image image={image} />
      {image.caption && <figcaption>{image.caption}</figcaption>}
      {image.description && <p id={id}>{image.description}</p>}
    </figure>
  );
}
