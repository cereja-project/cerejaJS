import { Breadcrumbs } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <Breadcrumbs
      items={[{ label: "Início", href: "/" }, { label: "Mídia atual" }]}
    />
  );
}
