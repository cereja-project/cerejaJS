import { useRef } from "react";
import {
  Button,
  EmptyState,
  useCarousel,
  useMediaConfig,
  type ImageData,
} from "@cereja-project/ui-core";
import { Figure } from "./Figure";
export interface CarouselProps {
  label: string;
  items: ImageData[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
}
export function Carousel({
  label,
  items,
  index,
  defaultIndex,
  onIndexChange,
}: CarouselProps) {
  const { labels } = useMediaConfig(),
    state = useCarousel({
      length: items.length,
      index,
      defaultIndex,
      onIndexChange,
    });
  if (!items.length) return <EmptyState title={labels.emptyMedia} />;
  return (
    <section
      className="md-carousel"
      role="region"
      aria-roledescription={labels.carousel}
      aria-label={label}
    >
      <div className="md-carousel-stage">
        <Figure key={items[state.index].id} image={items[state.index]} />
      </div>
      <div className="md-actions">
        <Button
          disabled={!state.canPrevious}
          onClick={() => state.go(state.index - 1)}
        >
          {labels.previous}
        </Button>
        <span role="status" aria-live="polite">
          {state.index + 1} {labels.of} {items.length}
        </span>
        <Button
          disabled={!state.canNext}
          onClick={() => state.go(state.index + 1)}
        >
          {labels.next}
        </Button>
      </div>
    </section>
  );
}
