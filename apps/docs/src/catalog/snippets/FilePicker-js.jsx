import { FilePicker } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <FilePicker
      label="Selecionar imagens"
      accept="image/*"
      multiple
      maxFiles={3}
    />
  );
}
