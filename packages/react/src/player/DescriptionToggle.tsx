import { Button, useMediaConfig } from "@cereja-project/ui-core";
export function DescriptionToggle({
  enabled,
  onToggle,
  autoFocus = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  autoFocus?: boolean;
}) {
  const { labels } = useMediaConfig();
  return (
    <Button autoFocus={autoFocus} aria-pressed={enabled} onClick={onToggle}>
      {enabled ? labels.original : labels.description}
    </Button>
  );
}
