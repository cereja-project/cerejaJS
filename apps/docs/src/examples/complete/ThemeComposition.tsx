import { MediaConfigProvider, EmptyState, Button } from "@cereja-project/ui-react";
import { ThemeExample } from "../theme";
import { HeadlessExample } from "../headless";
export function ThemeComposition() {
  return (
    <div className="example-stack">
      <ThemeExample />
      <MediaConfigProvider
        labels={{
          play: "Play",
          pause: "Pause",
          volume: "Volume",
          mute: "Mute",
          unmute: "Unmute",
          retry: "Try again",
        }}
      >
        <p>Tradução dos rótulos de reprodução e composição sem estilos:</p>
        <HeadlessExample />
      </MediaConfigProvider>
    </div>
  );
}
