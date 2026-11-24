import { Tabs } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Tabs
      label="Conteúdo"
      items={[
        { value: "one", label: "Descrição", content: "Descrição da mídia" },
        { value: "two", label: "Informações", content: "Outras informações" },
      ]}
    />
  );
}
