import { useRef, useState } from "react";
import {
  Carousel,
  ImageComparison,
  ImageViewer,
  Button,
  Separator,
} from "@cereja-project/ui-react";
import { images } from "../data";
export function ProductGallery() {
  const [index, setIndex] = useState(0),
    [active, setActive] = useState<string | null>(null);
  const opener = useRef<HTMLButtonElement>(null);
  return (
    <div className="example-stack">
      <Carousel
        label="Galeria de paisagens"
        items={images}
        index={index}
        onIndexChange={setIndex}
      />
      <Button ref={opener} onClick={() => setActive(images[index].id)}>
        Ampliar imagem atual
      </Button>
      <ImageViewer
        items={images}
        activeId={active}
        onActiveChange={setActive}
        returnFocusRef={opener}
      />
      <Separator />
      <ImageComparison
        label="Comparação de duas paisagens"
        before={images[0]}
        after={images[1]}
      />
      <p className="caption-note">
        Ilustrações diferentes demonstram os controles de comparação; não
        representam uma transformação real.
      </p>
    </div>
  );
}
