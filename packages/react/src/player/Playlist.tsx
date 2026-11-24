import { Button, useMediaConfig, type MediaSource } from "@cereja-project/ui-core";
export function Playlist({
  items,
  activeId,
  onSelect,
}: {
  items: Array<{ id: string; title: string; source: MediaSource }>;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const { labels } = useMediaConfig();
  return (
    <nav className="md-playlist" aria-label={labels.playlist}>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <Button
              aria-current={item.id === activeId ? "true" : undefined}
              onClick={() => onSelect(item.id)}
            >
              {item.title}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
