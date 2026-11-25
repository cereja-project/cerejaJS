import { useState } from "react";
import { Button, Status } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [action, setAction] = useState("");
  return (
    <>
      <Button onClick={() => setAction("Alterações salvas.")}>
        Salvar alterações
      </Button>
      <Status>{action}</Status>
    </>
  );
}
