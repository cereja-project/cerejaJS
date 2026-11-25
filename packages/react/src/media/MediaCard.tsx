import type { ReactNode } from "react";
import { Checkbox, useMediaConfig, type MediaItem } from "@cereja-project/ui-core";
import { Card } from "../layout/Card";
import { Figure } from "../images/Figure";
export interface MediaCardProps {
  item: MediaItem;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  action?: ReactNode;
}
export function MediaCard({
  item,
  selected = false,
  onSelect,
  action,
}: MediaCardProps) {
  const { labels } = useMediaConfig();
  return (
    <Card className="md-media-card">
      {item.image && <Figure image={item.image} />}
      <p className="md-media-card-title">{item.title}</p>
      {item.description && <p>{item.description}</p>}
      {item.meta && <p className="md-media-meta">{item.meta}</p>}
      {onSelect && (
        <Checkbox
          label={`${labels.selectItem} ${item.title}`}
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      )}
      {action && <div className="md-actions">{action}</div>}
    </Card>
  );
}
