import { useState } from "react";
import { Button, VisuallyHidden } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <Button aria-pressed={checked} onClick={() => setChecked(!checked)}>
      <span aria-hidden="true">☆</span>
      <VisuallyHidden>Favoritar mídia</VisuallyHidden>
    </Button>
  );
}
