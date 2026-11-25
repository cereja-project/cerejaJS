import { useState } from "react";
import {
  FilePicker,
  Field,
  Input,
  MediaPreview,
} from "@cereja-project/ui-react";
import "@cereja-project/ui-react/styles.css";
export function Example() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <FilePicker
        label="Selecionar mídia"
        files={files}
        onFilesChange={setFiles}
      />
      <Field label="Texto alternativo">
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <MediaPreview file={files[0] ?? null} alt={text} />
    </>
  );
}
