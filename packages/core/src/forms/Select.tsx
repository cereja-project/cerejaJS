import { forwardRef, type SelectHTMLAttributes } from "react";
import { useFieldControl } from "./useFieldControl";
export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select(
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
    <select
      {...props}
      {...field}
      ref={ref}
      className={`md-input md-select ${className}`}
    />
  );
});
