import { Button, Slider, useMedia, useMediaConfig } from "@cereja-project/ui-core";
import { timeDescription } from "./format";
export function SeekControl() {
  const { snapshot: s, execute } = useMedia(),
    { labels, config } = useMediaConfig();
  if (!s.capabilities.seek || !s.seekable.length) return null;
  const min = s.seekable[0].start,
    max = s.seekable.at(-1)!.end;
  if (max <= min) return null;
  return (
    <div className="md-seek">
      <Slider
        label={labels.progress}
        min={min}
        max={max}
        step={1}
        value={Math.max(min, Math.min(max, s.currentTime))}
        valueText={timeDescription(s.currentTime, labels)}
        onValueChange={(time) => void execute({ type: "seek", time })}
      />
      <div className="md-actions">
        <Button
          onClick={() =>
            void execute({
              type: "seek",
              time: s.currentTime - config.seekStep,
            })
          }
        >
          {labels.seekBack} {config.seekStep}s
        </Button>
        <Button
          onClick={() =>
            void execute({
              type: "seek",
              time: s.currentTime + config.seekStep,
            })
          }
        >
          {labels.seekForward} {config.seekStep}s
        </Button>
      </div>
    </div>
  );
}
