import { EmptyState, useMediaConfig } from "@cereja-project/ui-core";
export function MediaUnavailable({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { labels } = useMediaConfig();
  return (
    <EmptyState
      title={title ?? labels.mediaUnavailable}
      description={description ?? labels.mediaUnavailableDescription}
    />
  );
}
