import { useEffect, useState } from "react";
export function useObjectUrl(file: Blob | null): string | null {
  const [entry, setEntry] = useState<{ file: Blob; url: string } | null>(null);
  useEffect(() => {
    if (!file) {
      setEntry(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setEntry({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return entry?.file === file ? entry.url : null;
}
