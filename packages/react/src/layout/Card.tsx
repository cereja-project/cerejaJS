import { forwardRef, type HTMLAttributes } from "react";
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className = "", ...props }, ref) {
    return <div {...props} ref={ref} className={`md-card ${className}`} />;
  },
);
