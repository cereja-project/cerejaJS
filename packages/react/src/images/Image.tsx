/// <reference types="vite/client" />
import { useEffect, useState } from "react";
import { Status, Button, useMediaConfig, type ImageData } from "@cereja-project/ui-core";
function ImageContent({
  image,
  retry = true,
}: {
  image: ImageData;
  retry?: boolean;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading"),
    [attempt, setAttempt] = useState(0);
  const { labels } = useMediaConfig();
  const alt = image.decorative ? "" : image.alt;
  useEffect(() => {
    if (
      import.meta.env.DEV &&
      !image.decorative &&
      (!image.alt || !image.alt.trim())
    )
      console.warn(
        "Image: forneça um texto alternativo informativo ou declare decorative=true.",
      );
  }, [image]);
  return (
    <span className="md-image" aria-busy={state === "loading"}>
      {state === "error" ? (
        <>
          <span className="md-status" role="alert">
            {alt ? `${alt}: ` : ""}
            {labels.imageError}
          </span>
          {retry && (
            <Button
              onClick={() => {
                setState("loading");
                setAttempt((x) => x + 1);
              }}
            >
              {labels.retry}
            </Button>
          )}
        </>
      ) : (
        <img
          key={attempt}
          src={image.src}
          alt={alt ?? ""}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
        />
      )}
    </span>
  );
}
export function Image({ image, retry }: { image: ImageData; retry?: boolean }) {
  return <ImageContent key={image.src} image={image} retry={retry} />;
}
