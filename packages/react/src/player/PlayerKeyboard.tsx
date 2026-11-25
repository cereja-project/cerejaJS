import type { ReactNode, KeyboardEvent } from "react";
import { useMedia, useMediaConfig } from "@cereja-project/ui-core";
export function PlayerKeyboard({
  label,
  shortcuts = true,
  children,
}: {
  label: string;
  shortcuts?: boolean;
  children: ReactNode;
}) {
  const { snapshot, execute } = useMedia(),
    { config } = useMediaConfig();
  function keyDown(e: KeyboardEvent<HTMLElement>) {
    if (
      !shortcuts ||
      snapshot.status === "loading" ||
      snapshot.status === "error" ||
      e.defaultPrevented ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.nativeEvent.isComposing
    )
      return;
    const target = e.target as HTMLElement;
    if (
      target.closest(
        'input,textarea,select,button,a,[contenteditable],[role="slider"],[role="menu"]',
      )
    )
      return;
    switch (e.key.toLowerCase()) {
      case "k":
      case " ":
        e.preventDefault();
        void execute({
          type:
            !snapshot.paused &&
            (snapshot.status === "playing" || snapshot.status === "buffering")
              ? "pause"
              : "play",
        });
        break;
      case "m":
        if (snapshot.capabilities.volume) {
          e.preventDefault();
          void execute({ type: "mute", value: !snapshot.muted });
        }
        break;
      case "arrowleft":
      case "arrowright":
        if (snapshot.capabilities.seek) {
          e.preventDefault();
          void execute({
            type: "seek",
            time:
              snapshot.currentTime +
              (e.key === "ArrowLeft" ? -1 : 1) * config.seekStep,
          });
        }
        break;
    }
  }
  return (
    <section
      className="md-player"
      data-media-player
      aria-label={label}
      tabIndex={shortcuts ? 0 : undefined}
      onKeyDown={keyDown}
    >
      {children}
    </section>
  );
}
