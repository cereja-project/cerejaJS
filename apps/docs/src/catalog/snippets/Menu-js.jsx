import { useState } from "react";
import { Menu, Status } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [action, setAction] = useState("");
  return (
    <>
      <Menu
        label="Ações"
        items={[
          {
            id: "favorite",
            label: "Favoritar",
            onSelect: () => setAction("Favorito marcado."),
          },
        ]}
      />
      <Status>{action}</Status>
    </>
  );
}
