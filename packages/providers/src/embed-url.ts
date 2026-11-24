import type { MediaSource } from "@cereja-project/ui-core";
export function getEmbedUrl(source: Extract<MediaSource, { id: string }>): URL {
  const youtube = source.type === "youtube";
  if (youtube ? !/^[\w-]{11}$/.test(source.id) : !/^\d+$/.test(source.id))
    throw new Error("Identificador de mídia inválido.");
  const url = new URL(
    source.embedUrl ??
      (youtube
        ? `https://www.youtube-nocookie.com/embed/${source.id}`
        : `https://player.vimeo.com/video/${source.id}`),
  );
  const hosts = youtube
    ? ["www.youtube.com", "www.youtube-nocookie.com"]
    : ["player.vimeo.com"];
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    !hosts.includes(url.hostname) ||
    url.port ||
    url.pathname !== (youtube ? "/embed/" : "/video/") + source.id
  )
    throw new Error("URL de incorporação inválida.");
  return url;
}
