import type { ReactNode } from "react";
import { EmptyState, useMediaConfig, type MediaItem } from "@cereja-project/ui-core";
import { MediaCard } from "./MediaCard";
export interface MediaCollectionProps {
  items: MediaItem[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  renderAction?: (item: MediaItem) => ReactNode;
}
export function MediaCollection({
  items,
  selectedIds = [],
  onSelectionChange,
  renderAction,
  layout,
}: { items: MediaItem[]; layout: "grid" | "list" } & Omit<
  MediaCollectionProps,
  "items"
>) {
  const { labels } = useMediaConfig();
  if (!items.length) return <EmptyState title={labels.emptyMedia} />;
  const valid = selectedIds.filter((id) =>
    items.some((item) => item.id === id),
  );
  return (
    <ul
      className={`md-media-collection md-media-${layout}`}
      aria-label={labels.mediaLibrary}
    >
      {items.map((item) => (
        <li key={item.id}>
          <MediaCard
            item={item}
            selected={valid.includes(item.id)}
            onSelect={
              onSelectionChange
                ? (checked) =>
                    onSelectionChange([
                      ...new Set(
                        checked
                          ? [...valid, item.id]
                          : valid.filter((id) => id !== item.id),
                      ),
                    ])
                : undefined
            }
            action={renderAction?.(item)}
          />
        </li>
      ))}
    </ul>
  );
}
export function MediaGrid(props: MediaCollectionProps) {
  return <MediaCollection {...props} layout="grid" />;
}
