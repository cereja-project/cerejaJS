import { useRef, useState } from "react";
import { Button, useMediaConfig, type ImageData } from "@cereja-project/ui-core";
import { Image } from "./Image";
import { ImageViewer } from "./ImageViewer";
export function Gallery({ items }: { items: ImageData[] }) {
  const { labels } = useMediaConfig();
  const [activeId, setActiveId] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      className="md-gallery"
      data-md-gallery
      aria-label={labels.gallery}
      tabIndex={-1}
      ref={ref}
    >
      <ul className="md-gallery-grid">
        {items.map((image, index) => (
          <li key={image.id}>
            <Button
              className="md-gallery-trigger"
              aria-label={`${labels.openImage}: ${!image.decorative ? image.alt : (image.caption ?? String(index + 1))}`}
              onClick={() => setActiveId(image.id)}
            >
              <Image
                retry={false}
                image={{ ...image, decorative: true, alt: undefined }}
              />
              {image.caption && <span>{image.caption}</span>}
            </Button>
          </li>
        ))}
      </ul>
      <ImageViewer
        items={items}
        activeId={activeId}
        onActiveChange={setActiveId}
        returnFocusRef={ref}
      />
    </section>
  );
}
