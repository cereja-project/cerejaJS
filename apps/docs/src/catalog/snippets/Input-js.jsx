import { Field, Input } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Field label="Email">
      <Input type="email" name="email" autoComplete="email" />
    </Field>
  );
}
