import { useState } from "react";
export function useCarousel({
  length,
  index,
  defaultIndex = 0,
  onIndexChange,
}: {
  length: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
}) {
  const [internal, setInternal] = useState(defaultIndex),
    last = Math.max(0, length - 1);
  const clamp = (n: number) =>
    Math.max(0, Math.min(last, Number.isFinite(n) ? Math.floor(n) : 0));
  const active = clamp(index ?? internal);
  return {
    index: active,
    canPrevious: length > 0 && active > 0,
    canNext: length > 0 && active < last,
    go(next: number) {
      const target = clamp(next);
      if (target === active || length === 0) return;
      if (index === undefined) setInternal(target);
      onIndexChange?.(target);
    },
  };
}
