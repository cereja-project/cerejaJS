import type { CommandResult, MediaError } from "@cereja-project/ui-core";
export function failure(
  code: MediaError["code"],
  message: string,
  cause?: unknown,
): CommandResult {
  return {
    ok: false,
    error: {
      code,
      message,
      recoverable: code !== "aborted" && code !== "unsupported",
      cause,
    },
  };
}
export function commandError(cause: unknown): CommandResult {
  return failure(
    cause instanceof DOMException && cause.name === "NotAllowedError"
      ? "blocked"
      : "provider",
    "Não foi possível executar a ação. Tente novamente.",
    cause,
  );
}
export function safeMediaUrl(src: string): string {
  const url = new URL(
    src,
    typeof document === "undefined" ? "https://localhost/" : document.baseURI,
  );
  if (!["https:", "http:", "blob:"].includes(url.protocol))
    throw new Error("Protocolo de mídia não permitido.");
  return src;
}
