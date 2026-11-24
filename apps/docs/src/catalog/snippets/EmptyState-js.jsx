import { EmptyState } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <EmptyState
      title="Nenhum resultado"
      description="Altere os termos da busca."
    />
  );
}
