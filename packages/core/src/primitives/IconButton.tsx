import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Button } from "./Button";
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function IconButton({ label, children, ...props }, ref) {
  return (
    <Button {...props} ref={ref} aria-label={label}>
      <span aria-hidden="true">{children}</span>
    </Button>
  );
});
