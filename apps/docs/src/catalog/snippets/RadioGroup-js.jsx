import { RadioGroup } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <RadioGroup
      label="Qualidade"
      name="quality"
      defaultValue="standard"
      options={[
        { value: "standard", label: "Padrão" },
        { value: "high", label: "Alta" },
      ]}
    />
  );
}
