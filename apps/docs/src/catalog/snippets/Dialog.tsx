import { useState } from "react";
import { Dialog, Button } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      title="Detalhes"
      description="Informações da mídia"
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Abrir diálogo</Button>}
    >
      <p>Conteúdo complementar.</p>
    </Dialog>
  );
}
