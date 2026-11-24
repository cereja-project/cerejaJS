import { Button, useMedia, useMediaConfig } from "@cereja-project/ui-core";
export function LiveControl() {
  const { snapshot: s, execute } = useMedia(),
    { labels } = useMediaConfig();
  if (!s.live) return null;
  return (
    <span className="md-live">
      <span>{labels.live}</span>
      {s.capabilities.seek && s.seekable.length > 0 && (
        <Button onClick={() => void execute({ type: "goLive" })}>
          {labels.goLive}
        </Button>
      )}
    </span>
  );
}
