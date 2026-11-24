import { VideoPlayer } from "@cereja-project/ui-react";
export function VideoExampleJS() {
  return (
    <VideoPlayer
      label="Meu vídeo"
      source={{ type: "file", src: "/meu-video.mp4" }}
      tracks={[
        {
          id: "pt",
          kind: "captions",
          src: "/legendas.vtt",
          language: "pt-BR",
          label: "Português",
        },
      ]}
    />
  );
}
