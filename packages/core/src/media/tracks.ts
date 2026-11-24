import type { TextTrackInput } from "./types";
export function attachTextTracks(
  media: HTMLMediaElement,
  tracks: TextTrackInput[],
): () => void {
  const elements = tracks.map((input) => {
    const url = new URL(input.src, document.baseURI);
    if (!["https:", "http:", "blob:"].includes(url.protocol))
      throw new Error("URL de legenda inválida.");
    const track = document.createElement("track");
    track.id = input.id;
    track.kind = input.kind;
    track.srclang = input.language;
    track.label = input.label;
    track.src = input.src;
    track.default = !!input.default;
    return track;
  });
  media.append(...elements);
  return () => elements.forEach((el) => el.remove());
}
