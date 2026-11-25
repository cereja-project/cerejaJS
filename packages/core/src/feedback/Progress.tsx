import { useId } from "react";
export function Progress({
  label,
  value,
  max = 100,
}: {
  label: string;
  value?: number;
  max?: number;
}) {
  const id = useId(),
    maximum = Number.isFinite(max) && max > 0 ? max : 100,
    v =
      value !== undefined && Number.isFinite(value)
        ? Math.max(0, Math.min(maximum, value))
        : undefined;
  return (
    <label className="md-progress" htmlFor={id}>
      <span>{label}</span>
      <progress id={id} max={maximum} value={v} />
    </label>
  );
}
