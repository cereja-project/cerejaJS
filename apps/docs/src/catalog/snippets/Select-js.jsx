import { Field, Select } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Field label="Formato">
      <Select defaultValue="audio">
        <option value="audio">Áudio</option>
        <option value="video">Vídeo</option>
      </Select>
    </Field>
  );
}
