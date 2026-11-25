import { forwardRef, useId, type InputHTMLAttributes } from "react";
export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children" | "onChange" | "role"
> & { label: string; onCheckedChange?: (checked: boolean) => void };
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, id: provided, onCheckedChange, className = "", ...props },
  ref,
) {
  const generated = useId(),
    id = provided ?? generated;
  return (
    <label className={`md-switch ${className}`} htmlFor={id}>
      <input
        {...props}
        id={id}
        type="checkbox"
        role="switch"
        ref={ref}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <span className="md-switch-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
});
