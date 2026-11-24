import { forwardRef, type TextareaHTMLAttributes } from "react";
import { useFieldControl } from "./useFieldControl";
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea(
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
    <textarea
      {...props}
      {...field}
      ref={ref}
      className={`md-input md-textarea ${className}`}
    />
  );
});
