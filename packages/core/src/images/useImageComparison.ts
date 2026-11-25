import { useState } from "react";
import { useMediaConfig } from "../config";
export function useImageComparison({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
} = {}) {
  const { config } = useMediaConfig(),
    [internal, setInternal] = useState(
      defaultValue ?? config.comparisonInitial,
    );
  const clamp = (n: number) =>
    Math.max(
      0,
      Math.min(100, Number.isFinite(n) ? n : config.comparisonInitial),
    );
  const position = clamp(value ?? internal);
  return {
    value: position,
    setValue(next: number) {
      const target = clamp(next);
      if (value === undefined) setInternal(target);
      onValueChange?.(target);
    },
  };
}
