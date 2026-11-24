import { useEffect, useRef, useState, type RefObject } from "react";
import { Button, Dialog, useMediaConfig, type ImageData } from "@cereja-project/ui-core";
import { Image } from "./Image";
export interface ImageViewerProps {
  items: ImageData[];
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}
export function ImageViewer({
  items,
  activeId,
  onActiveChange,
  returnFocusRef,
}: ImageViewerProps) {
  const { labels, config } = useMediaConfig();
  const [zoom, setZoom] = useState(config.zoomMin);
  const viewport = useRef<HTMLDivElement>(null),
    opener = useRef<HTMLElement | null>(null),
    anchor = useRef<HTMLDivElement>(null);
  const index = items.findIndex((item) => item.id === activeId),
    image = items[index];
  useEffect(() => {
    setZoom(config.zoomMin);
    if (viewport.current) {
      viewport.current.scrollTop = 0;
      viewport.current.scrollLeft = 0;
    }
  }, [activeId, config.zoomMin]);
  useEffect(() => {
    if (activeId !== null && !image) onActiveChange(null);
  }, [activeId, image, onActiveChange]);
  function pan(x: number, y: number) {
    if (viewport.current) {
      viewport.current.scrollLeft += x;
      viewport.current.scrollTop += y;
    }
  }
  return (
    <div
      ref={anchor}
      tabIndex={-1}
      className="md-viewer-anchor"
      role={returnFocusRef ? undefined : "group"}
      aria-label={returnFocusRef ? undefined : labels.imageViewer}
    >
      {!returnFocusRef && (
        <span className="md-viewer-fallback">{labels.imageViewer}</span>
      )}
      <Dialog
        title={labels.imageViewer}
        description={image && !image.decorative ? image.alt : undefined}
        open={!!image}
        onOpenChange={(open) => {
          if (!open) onActiveChange(null);
        }}
        onOpenAutoFocus={() => {
          opener.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          const target =
            opener.current?.isConnected &&
            opener.current !== document.body &&
            opener.current !== document.documentElement
              ? opener.current
              : (returnFocusRef?.current ?? anchor.current);
          target?.focus();
        }}
      >
        {image && (
          <>
            <div className="md-actions md-viewer-actions">
              <Button
                disabled={index === 0}
                onClick={() => onActiveChange(items[index - 1].id)}
              >
                {labels.previous}
              </Button>
              <span>
                {index + 1} {labels.of} {items.length}
              </span>
              <Button
                disabled={index === items.length - 1}
                onClick={() => onActiveChange(items[index + 1].id)}
              >
                {labels.next}
              </Button>
              <Button
                disabled={zoom <= config.zoomMin}
                onClick={() =>
                  setZoom((z) => Math.max(config.zoomMin, z - config.zoomStep))
                }
              >
                {labels.zoomOut}
              </Button>
              <span role="status" aria-label={labels.zoom}>
                {Math.round(zoom * 100)}%
              </span>
              <Button
                disabled={zoom >= config.zoomMax}
                onClick={() =>
                  setZoom((z) => Math.min(config.zoomMax, z + config.zoomStep))
                }
              >
                {labels.zoomIn}
              </Button>
              <Button onClick={() => setZoom(config.zoomMin)}>
                {labels.resetZoom}
              </Button>
            </div>
            <div
              className="md-viewer-viewport"
              ref={viewport}
              tabIndex={zoom > config.zoomMin ? 0 : undefined}
              role="group"
              aria-label={labels.imageViewer}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                const delta = config.panStep;
                const directions: Record<string, [number, number]> = {
                  ArrowLeft: [-delta, 0],
                  ArrowRight: [delta, 0],
                  ArrowUp: [0, -delta],
                  ArrowDown: [0, delta],
                };
                if (directions[e.key]) {
                  e.preventDefault();
                  pan(...directions[e.key]);
                }
              }}
            >
              <div style={{ width: `${zoom * 100}%`, minWidth: "100%" }}>
                <Image image={image} />
              </div>
            </div>
            {zoom > config.zoomMin && (
              <div className="md-actions">
                <Button onClick={() => pan(-config.panStep, 0)}>
                  {labels.panLeft}
                </Button>
                <Button onClick={() => pan(config.panStep, 0)}>
                  {labels.panRight}
                </Button>
                <Button onClick={() => pan(0, -config.panStep)}>
                  {labels.panUp}
                </Button>
                <Button onClick={() => pan(0, config.panStep)}>
                  {labels.panDown}
                </Button>
              </div>
            )}
            {image.caption && <p>{image.caption}</p>}
            {image.description && <p>{image.description}</p>}
          </>
        )}
      </Dialog>
    </div>
  );
}
