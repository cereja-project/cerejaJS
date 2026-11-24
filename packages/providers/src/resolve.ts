import type { AdapterFactory, MediaSource } from "@cereja-project/ui-core";
export async function resolveAdapter(
  type: MediaSource["type"],
): Promise<AdapterFactory> {
  switch (type) {
    case "file":
      return (await import("./native")).createNativeAdapter;
    case "hls":
      return (await import("./hls")).createHlsAdapter;
    case "dash":
      return (await import("./dash")).createDashAdapter;
    case "youtube":
      return (await import("./youtube")).createYouTubeAdapter;
    case "vimeo":
      return (await import("./vimeo")).createVimeoAdapter;
    default:
      throw new Error(`Adaptador ${type} ainda não instalado.`);
  }
}
export const autoAdapter: AdapterFactory = async (options) =>
  (await resolveAdapter(options.source.type))(options);
