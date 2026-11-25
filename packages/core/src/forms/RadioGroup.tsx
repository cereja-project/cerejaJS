import { useId, useState } from "react";
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}
export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  required,
  error,
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue),
    id = useId(),
    selected = value ?? internal;
  return (
    <fieldset
      className="md-radio-group"
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </legend>
      {options.map((option, index) => (
        <label
          className="md-radio-option"
          key={option.value}
          htmlFor={`${id}-${index}`}
        >
          <input
            id={`${id}-${index}`}
            name={name}
            value={option.value}
            type="radio"
            checked={selected === option.value}
            disabled={option.disabled}
            required={required}
            onChange={() => {
              if (value === undefined) setInternal(option.value);
              onValueChange?.(option.value);
            }}
          />
          <span>{option.label}</span>
        </label>
      ))}
      {error && (
        <p id={`${id}-error`} className="md-field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
