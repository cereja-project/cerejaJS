import { VideoPlayer } from "@cereja-project/ui-react";
export function YouTubeExample() {
  return (
    <VideoPlayer
      label="YouTube — demonstração da IFrame API"
      source={{ type: "youtube", id: "M7lc1UVf-VE" }}
      loadStrategy="on-interaction"
    />
  );
}
