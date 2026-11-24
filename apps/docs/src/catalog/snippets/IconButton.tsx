import { useState } from "react";
import { IconButton } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <IconButton
      label="Favoritar mídia"
      aria-pressed={checked}
      onClick={() => setChecked(!checked)}
    >
      ☆
    </IconButton>
  );
}
