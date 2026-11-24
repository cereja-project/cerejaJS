export interface FileValidationOptions {
  accept?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
}
export interface RejectedFile {
  file: File;
  reason: "type" | "size" | "count";
}
const mimeByExtension: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};
export function fileMime(file: File): string {
  return (
    file.type.toLowerCase() ||
    mimeByExtension[file.name.split(".").at(-1)?.toLowerCase() ?? ""] ||
    ""
  );
}
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {},
) {
  for (const [name, value] of Object.entries({
    maxFiles: options.maxFiles,
    maxSizeBytes: options.maxSizeBytes,
  })) {
    if (
      value !== undefined &&
      (!Number.isFinite(value) || value < 0 || !Number.isInteger(value))
    )
      throw new RangeError(`${name} deve ser um inteiro não negativo.`);
  }
  const patterns = (options.accept ?? "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const accepted: File[] = [],
    rejected: RejectedFile[] = [];
  for (const file of files) {
    const mime = fileMime(file),
      name = file.name.toLowerCase(),
      typeValid =
        !patterns.length ||
        patterns.some((pattern) =>
          pattern.startsWith(".")
            ? name.endsWith(pattern)
            : pattern.endsWith("/*")
              ? mime.startsWith(pattern.slice(0, -1))
              : mime === pattern,
        );
    const reason = !typeValid
      ? "type"
      : options.maxSizeBytes !== undefined && file.size > options.maxSizeBytes
        ? "size"
        : accepted.length >= (options.maxFiles ?? Infinity)
          ? "count"
          : null;
    if (reason) rejected.push({ file, reason });
    else accepted.push(file);
  }
  return { accepted, rejected };
}
