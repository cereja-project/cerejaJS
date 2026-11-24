import { useState } from "react";
import {
  CompactAudioPlayer,
  Playlist,
  TranscriptSearch,
} from "@cereja-project/ui-react";
import { cues } from "../data";
export function Podcast() {
  const episodes = [
    {
      id: "one",
      title: "Episódio 1 — áudio de teste",
      source: { type: "file" as const, src: "/fixtures/media/sample.mp3" },
    },
    {
      id: "two",
      title: "Episódio 2 — áudio de teste",
      source: {
        type: "file" as const,
        src: "/fixtures/media/sample.mp3?episode=2",
      },
    },
  ];
  const [active, setActive] = useState("one");
  const episode = episodes.find((e) => e.id === active)!;
  return (
    <div className="example-stack">
      <CompactAudioPlayer label={episode.title} source={episode.source}>
        <TranscriptSearch cues={cues} />
      </CompactAudioPlayer>
      <Playlist items={episodes} activeId={active} onSelect={setActive} />
      <p className="caption-note">
        As faixas são amostras técnicas locais. A transcrição demonstra busca e
        navegação, sem simular um episódio editorial.
      </p>
    </div>
  );
}
