import { useState } from "react";
import { MediaErrorState, Status } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [action, setAction] = useState("");
  return (
    <>
      <MediaErrorState
        onRetry={() => setAction("Nova tentativa solicitada.")}
      />
      <Status>{action}</Status>
    </>
  );
}
