import { useId } from "react";
export interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueText: string;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}
export function Slider({
  label,
  min,
  max,
  step,
  value,
  valueText,
  onValueChange,
  disabled,
}: SliderProps) {
  const id = useId();
  return (
    <label className="md-slider" htmlFor={id}>
      <span className="md-slider-label">{label}</span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        disabled={disabled}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
    </label>
  );
}
