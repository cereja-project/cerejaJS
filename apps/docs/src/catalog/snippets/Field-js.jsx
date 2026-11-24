import { Field, Input } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Field label="Nome" description="Como você quer ser chamado?">
      <Input name="name" autoComplete="name" />
    </Field>
  );
}
