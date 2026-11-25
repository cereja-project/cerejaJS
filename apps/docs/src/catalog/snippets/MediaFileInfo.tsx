import { MediaFileInfo } from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  return (
    <MediaFileInfo
      file={new File(["Amostra"], "amostra.txt", { type: "text/plain" })}
    />
  );
}
