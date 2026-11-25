import { VideoPlayer } from "@cereja-project/ui-react";
import { media, tracks } from "./data";
export function DescriptionExample() {
  return (
    <VideoPlayer
      label="Versão descrita — narração em inglês"
      source={{ type: "file", src: media }}
      tracks={tracks}
      describedSource={{ type: "file", src: "/fixtures/media/described.mp4" }}
      describedTracks={[
        {
          id: "ad-en",
          src: "/fixtures/tracks/described.vtt",
          language: "en",
          label: "English — described version",
          kind: "captions",
          default: true,
        },
      ]}
    />
  );
}
