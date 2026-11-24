import { forwardRef, useId, type InputHTMLAttributes } from "react";
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & { label: string; description?: string };
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      description,
      id: provided,
      "aria-describedby": describedBy,
      className = "",
      ...props
    },
    ref,
  ) {
    const generated = useId(),
      id = provided ?? generated,
      descriptionId = description ? `${id}-description` : undefined;
    return (
      <div className={`md-choice ${className}`}>
        <label htmlFor={id}>
          <input
            {...props}
            type="checkbox"
            id={id}
            ref={ref}
            aria-describedby={
              [descriptionId, describedBy].filter(Boolean).join(" ") ||
              undefined
            }
          />
          <span>{label}</span>
        </label>
        {description && (
          <p id={descriptionId} className="md-field-description">
            {description}
          </p>
        )}
      </div>
    );
  },
);
