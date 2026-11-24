import type { AriaAttributes } from "react";
import { useFieldContext } from "./Field";
export function useFieldControl({
  id,
  describedBy,
  invalid,
  required,
}: {
  id?: string;
  describedBy?: string;
  invalid?: AriaAttributes["aria-invalid"];
  required?: boolean;
} = {}) {
  const context = useFieldContext();
  const descriptions =
    [context?.descriptionId, context?.errorId, describedBy]
      .filter(Boolean)
      .join(" ") || undefined;
  return {
    id: id ?? context?.controlId,
    "aria-describedby": descriptions,
    "aria-invalid": context?.invalid ? true : invalid,
    required: required ?? context?.required,
  };
}
