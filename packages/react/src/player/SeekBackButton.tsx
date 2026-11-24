import {
  Button,
  useMedia,
  useMediaConfig,
  defaultConfig,
} from "@cereja-project/ui-core";
export function SeekButton({
  seconds,
  direction,
}: {
  seconds?: number;
  direction: -1 | 1;
}) {
  const { snapshot: s, execute } = useMedia(),
    { labels, config } = useMediaConfig(),
    step = seconds ?? config.seekStep,
    amount = Number.isFinite(step) && step > 0 ? step : defaultConfig.seekStep;
  return (
    <Button
      disabled={!s.capabilities.seek}
      onClick={() =>
        void execute({ type: "seek", time: s.currentTime + direction * amount })
      }
    >
      {direction < 0 ? labels.seekBack : labels.seekForward} {amount}{" "}
      {labels.seconds}
    </Button>
  );
}
export function SeekBackButton({ seconds }: { seconds?: number }) {
  return <SeekButton seconds={seconds} direction={-1} />;
}
