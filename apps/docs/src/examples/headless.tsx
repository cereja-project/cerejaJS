import { MediaRoot, MediaHost, useMedia, Button } from "@cereja-project/ui-react";
import { autoAdapter } from "@cereja-project/ui-providers";
function CustomControls() {
  const { snapshot, execute } = useMedia();
  return (
    <div className="headless-controls">
      <Button
        disabled={snapshot.status === "loading"}
        onClick={() =>
          void execute({
            type: !snapshot.paused ? "pause" : "play",
          })
        }
      >
        {!snapshot.paused ? "Pausar áudio" : "Ouvir áudio"}
      </Button>
      <span>Composição com MediaRoot + useMedia</span>
    </div>
  );
}
export function HeadlessExample() {
  return (
    <MediaRoot
      kind="audio"
      source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
      adapterFactory={autoAdapter}
    >
      <MediaHost />
      <CustomControls />
    </MediaRoot>
  );
}
