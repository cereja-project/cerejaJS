import { Progress } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return <Progress label="Processamento" value={40} max={100} />;
}
