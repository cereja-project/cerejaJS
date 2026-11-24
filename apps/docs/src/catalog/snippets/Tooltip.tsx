import { useState } from "react";
import { Tooltip, IconButton } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Tooltip content="Adicionar aos favoritos">
      <IconButton
        label="Adicionar aos favoritos"
        aria-pressed={checked}
        onClick={() => setChecked(!checked)}
      >
        ☆
      </IconButton>
    </Tooltip>
  );
}
