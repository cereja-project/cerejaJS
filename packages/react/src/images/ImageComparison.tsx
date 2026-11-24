import { useState } from "react";
import {
  Button,
  Slider,
  VisuallyHidden,
  useImageComparison,
  useMediaConfig,
  type ImageData,
} from "@cereja-project/ui-core";
import { Image } from "./Image";
export interface ImageComparisonProps {
  label: string;
  before: ImageData;
  after: ImageData;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}
export function ImageComparison({
  label,
  before,
  after,
  value,
  defaultValue,
  onValueChange,
}: ImageComparisonProps) {
  const { labels, config } = useMediaConfig(),
    state = useImageComparison({ value, defaultValue, onValueChange }),
    [sideBySide, setSideBySide] = useState(false);
  return (
    <section className="md-comparison" aria-label={label}>
      <div
        className={`md-comparison-images ${sideBySide ? "md-comparison-side" : "md-comparison-overlay"}`}
      >
        <figure>
          <Image image={after} retry={false} />
          <figcaption>{labels.after}</figcaption>
        </figure>
        <figure
          style={
            sideBySide
              ? undefined
              : { clipPath: `inset(0 ${100 - state.value}% 0 0)` }
          }
        >
          <Image image={before} retry={false} />
          <figcaption>{labels.before}</figcaption>
        </figure>
      </div>
      <Slider
        label={labels.comparisonPosition}
        min={0}
        max={100}
        step={1}
        value={state.value}
        valueText={`${state.value}% ${labels.before}`}
        onValueChange={state.setValue}
      />
      <div className="md-actions">
        <Button
          disabled={state.value >= 100}
          onClick={() => state.setValue(state.value + config.comparisonStep)}
        >
          {labels.moreBefore}
        </Button>
        <Button
          disabled={state.value <= 0}
          onClick={() => state.setValue(state.value - config.comparisonStep)}
        >
          {labels.moreAfter}
        </Button>
        <Button
          aria-pressed={sideBySide}
          onClick={() => setSideBySide((v) => !v)}
        >
          {labels.sideBySide}
        </Button>
      </div>
    </section>
  );
}
