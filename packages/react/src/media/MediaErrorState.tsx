import { Alert, Button, useMediaConfig } from "@cereja-project/ui-core";
export function MediaErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { labels } = useMediaConfig();
  return (
    <Alert tone="error" announce="polite">
      <p>{message ?? labels.error}</p>
      {onRetry && <Button onClick={onRetry}>{labels.retry}</Button>}
    </Alert>
  );
}
