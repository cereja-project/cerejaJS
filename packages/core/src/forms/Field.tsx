import { createContext, useContext, useId, type ReactElement } from "react";
import { useMediaConfig } from "../config";
export interface FieldContextValue {
  controlId: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
}
const Context = createContext<FieldContextValue | null>(null);
export function useFieldContext() {
  return useContext(Context);
}
export function Field({
  label,
  description,
  error,
  required = false,
  children,
}: {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactElement<{ id?: string }>;
}) {
  const generated = useId(),
    id = children.props.id ?? generated;
  const { labels } = useMediaConfig();
  return (
    <Context.Provider
      value={{
        controlId: id,
        descriptionId: description ? `${id}-description` : undefined,
        errorId: error ? `${id}-error` : undefined,
        invalid: !!error,
        required,
      }}
    >
      <div className="md-field">
        <label htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        {children}
        {description && (
          <p id={`${id}-description`} className="md-field-description">
            {description}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="md-field-error">
            {error}
          </p>
        )}
      </div>
    </Context.Provider>
  );
}
