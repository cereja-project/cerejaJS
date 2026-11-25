import { createRoot } from "react-dom/client";
import { VideoPlayer, Gallery } from "../../packages/react/src";
import "../../packages/react/src/styles/all.css";
createRoot(document.getElementById("root")!).render(
  <>
    <VideoPlayer
      label="Vídeo de exemplo"
      source={{ type: "file", src: "/fixtures/media/sample.mp4" }}
      tracks={[
        {
          id: "pt",
          kind: "captions",
          src: "/fixtures/tracks/sample.vtt",
          language: "pt-BR",
          label: "Português",
        },
      ]}
      transcript={[
        {
          id: "one",
          start: 0,
          end: 12,
          text: "Um tom acompanha um padrão visual de teste.",
        },
      ]}
    />
    <Gallery
      items={[
        {
          id: "one",
          src: "/illustrations/mountains.svg",
          alt: "Duas montanhas geométricas com neve nos picos.",
        },
        {
          id: "two",
          src: "/illustrations/coast.svg",
          alt: "Barco perto da praia.",
        },
      ]}
    />
  </>,
);
