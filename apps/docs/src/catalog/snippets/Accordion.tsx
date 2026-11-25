import { Accordion } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Accordion
      items={[
        {
          id: "details",
          title: "Detalhes da mídia",
          content: "Conteúdo complementar",
        },
      ]}
    />
  );
}
