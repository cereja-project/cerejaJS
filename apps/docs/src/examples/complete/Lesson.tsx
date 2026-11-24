import {
  VideoPlayer,
  ChapterList,
  TranscriptSearch,
  Alert,
} from "@cereja-project/ui-react";
import { media, tracks, cues, chapters } from "../data";
export function Lesson() {
  return (
    <div className="example-stack">
      <VideoPlayer
        label="Aula de demonstração — fixture técnica"
        source={{ type: "file", src: media }}
        poster="/illustrations/mountains.svg"
        tracks={tracks}
        describedSource={{ type: "file", src: "/fixtures/media/described.mp4" }}
        describedTracks={[
          {
            id: "en",
            src: "/fixtures/tracks/described.vtt",
            kind: "captions",
            language: "en",
            label: "English — described version",
            default: true,
          },
        ]}
      >
        <ChapterList chapters={chapters} />
        <TranscriptSearch cues={cues} />
      </VideoPlayer>
      <Alert title="Sobre o conteúdo">
        O vídeo é um padrão visual de teste. A versão descrita contém narração
        sintética em inglês.
      </Alert>
    </div>
  );
}
