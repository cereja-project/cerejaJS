import { VideoPlayer } from "@cereja-project/ui-react";
export function VimeoExample() {
  return (
    <VideoPlayer
      label="Vimeo — demonstração do provedor"
      source={{ type: "vimeo", id: "76979871" }}
      loadStrategy="on-interaction"
    />
  );
}
