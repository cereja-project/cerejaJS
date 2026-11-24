import { forwardRef, type InputHTMLAttributes } from "react";
import { useFieldControl } from "./useFieldControl";
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "number"
    | "date"
    | "datetime-local"
    | "month"
    | "week"
    | "time";
};
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    required,
    className = "",
    ...props
  },
  ref,
) {
  const field = useFieldControl({ id, describedBy, invalid, required });
  return (
    <input
      type="text"
      {...props}
      {...field}
      ref={ref}
      className={`md-input ${className}`}
    />
  );
});
