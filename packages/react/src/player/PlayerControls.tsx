import { Button, Menu, Status, useMedia, useMediaConfig } from "@cereja-project/ui-core";
import { SeekControl } from "./SeekControl";
import { VolumeControl } from "./VolumeControl";
import { LiveControl } from "./LiveControl";
import { TimeDisplay } from "./TimeDisplay";
export function PlayerControls() {
  const { snapshot: s, execute } = useMedia(),
    { labels, config } = useMediaConfig();
  const error = s.error;
  const rates = config.rates.filter(
    (rate) =>
      Number.isFinite(rate) &&
      rate > 0 &&
      (!s.availablePlaybackRates || s.availablePlaybackRates.includes(rate)),
  );
  const showRates =
    s.capabilities.rate &&
    rates.length > 0 &&
    (rates.length > 1 || rates[0] !== s.playbackRate);
  async function toggle() {
    await execute({
      type:
        !s.paused && (s.status === "playing" || s.status === "buffering")
          ? "pause"
          : "play",
    });
  }
  return (
    <div className="md-controls" role="group" aria-label={labels.controls}>
      <SeekControl />
      <div className="md-actions">
        <Button
          data-media-play
          disabled={s.status === "loading" || s.status === "error"}
          onClick={() => void toggle()}
        >
          {!s.paused && (s.status === "playing" || s.status === "buffering")
            ? labels.pause
            : labels.play}
        </Button>
        <TimeDisplay />
        <LiveControl />
        {showRates && (
          <Menu
            label={labels.speed}
            items={rates.map((rate) => ({
              id: String(rate),
              label: `${rate}×`,
              checked: s.playbackRate === rate,
              onSelect: () => void execute({ type: "rate", value: rate }),
            }))}
          />
        )}
        {s.capabilities.fullscreen && (
          <Button
            onClick={() => void execute({ type: "fullscreen", value: true })}
          >
            {labels.fullscreen}
          </Button>
        )}
        {s.capabilities.pictureInPicture && (
          <Button
            onClick={() =>
              void execute({ type: "pictureInPicture", value: true })
            }
          >
            {labels.pip}
          </Button>
        )}
      </div>
      <VolumeControl />
      {(s.status === "loading" || s.status === "buffering") && (
        <Status>
          {s.status === "loading" ? labels.loading : labels.buffering}
        </Status>
      )}
      {error && (
        <Status error>
          {error.code === "blocked"
            ? labels.blocked
            : error.code === "unsupported"
              ? labels.unsupported
              : labels.error}
        </Status>
      )}
    </div>
  );
}
