import { Field, Textarea } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Field label="Mensagem">
      <Textarea name="message" rows={3} />
    </Field>
  );
}
