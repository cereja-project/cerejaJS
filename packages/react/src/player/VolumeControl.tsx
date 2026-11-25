import { Button, Slider, useMedia, useMediaConfig } from "@cereja-project/ui-core";
export function VolumeControl() {
  const { snapshot: s, execute } = useMedia(),
    { labels, config } = useMediaConfig();
  if (!s.capabilities.volume) return null;
  return (
    <div className="md-volume">
      <Button
        aria-pressed={s.muted}
        onClick={() => void execute({ type: "mute", value: !s.muted })}
      >
        {s.muted ? labels.unmute : labels.mute}
      </Button>
      <Slider
        label={labels.volume}
        min={0}
        max={1}
        step={config.volumeStep}
        value={s.muted ? 0 : s.volume}
        valueText={`${Math.round((s.muted ? 0 : s.volume) * 100)}%`}
        onValueChange={(value) => {
          void execute({ type: "volume", value });
          if (s.muted && value > 0)
            void execute({ type: "mute", value: false });
        }}
      />
    </div>
  );
}
