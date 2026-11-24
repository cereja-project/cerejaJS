import { MediaCollection, type MediaCollectionProps } from "./MediaGrid";
export function MediaList(props: MediaCollectionProps) {
  return <MediaCollection {...props} layout="list" />;
}
