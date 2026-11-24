import { useId, useState } from "react";
import {
  Button,
  Alert,
  useMediaConfig,
  validateFiles,
  type RejectedFile,
} from "@cereja-project/ui-core";
export interface FilePickerProps {
  label: string;
  accept?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  multiple?: boolean;
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
}
export function FilePicker({
  label,
  accept,
  maxFiles,
  maxSizeBytes,
  multiple = false,
  files,
  defaultFiles = [],
  onFilesChange,
  disabled = false,
}: FilePickerProps) {
  const { labels } = useMediaConfig(),
    id = useId(),
    [internal, setInternal] = useState(defaultFiles),
    [rejected, setRejected] = useState<RejectedFile[]>([]);
  const current = files ?? internal;
  validateFiles([], { accept, maxFiles, maxSizeBytes });
  function change(next: File[]) {
    if (files === undefined) setInternal(next);
    onFilesChange?.(next);
  }
  return (
    <div className="md-file-picker">
      <label htmlFor={id} className="md-file-label">
        {label}
      </label>
      <p id={`${id}-hint`} className="md-field-description">
        {labels.localFilesOnly}
        {accept ? ` ${labels.acceptedTypes}: ${accept}.` : ""}
        {maxFiles !== undefined ? ` ${labels.maxFiles}: ${maxFiles}.` : ""}
        {maxSizeBytes !== undefined
          ? ` ${labels.maxBytes}: ${maxSizeBytes}.`
          : ""}
      </p>
      <input
        className="md-file-input"
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-describedby={`${id}-hint${rejected.length ? ` ${id}-errors` : ""}`}
        aria-invalid={rejected.length ? true : undefined}
        onChange={(e) => {
          const incoming = Array.from(e.currentTarget.files ?? []);
          if (!incoming.length) return;
          const result = validateFiles(
            multiple ? [...current, ...incoming] : incoming,
            {
              accept,
              maxSizeBytes,
              maxFiles: multiple ? maxFiles : Math.min(1, maxFiles ?? 1),
            },
          );
          setRejected(result.rejected);
          if (result.accepted.length) change(result.accepted);
          e.currentTarget.value = "";
        }}
      />
      {current.length > 0 && (
        <ul className="md-file-list">
          {current.map((file, i) => (
            <li key={`${file.name}:${file.size}:${file.lastModified}:${i}`}>
              <span>{file.name}</span>
              <Button
                disabled={disabled}
                aria-label={`${labels.remove} ${file.name}`}
                onClick={() => {
                  change(current.filter((_, index) => index !== i));
                  setRejected([]);
                }}
              >
                {labels.remove}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {rejected.length > 0 && (
        <div id={`${id}-errors`}>
          <Alert title={labels.filesRejected} tone="error" announce="polite">
            <ul>
              {rejected.map((r, i) => (
                <li key={i}>
                  {r.file.name}:{" "}
                  {r.reason === "type"
                    ? labels.fileTypeRejected
                    : r.reason === "size"
                      ? labels.fileSizeRejected
                      : labels.fileCountRejected}
                </li>
              ))}
            </ul>
          </Alert>
        </div>
      )}
    </div>
  );
}
