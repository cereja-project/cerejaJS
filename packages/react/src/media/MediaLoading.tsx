import { Skeleton, useMediaConfig } from "@cereja-project/ui-core";
export function MediaLoading({ label }: { label?: string }) {
  const { labels } = useMediaConfig();
  return <Skeleton label={label ?? labels.loading} height="10rem" />;
}
