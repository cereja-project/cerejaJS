import { Menu, useMedia, useMediaConfig, type Chapter } from "@cereja-project/ui-core";
import { formatTime } from "./format";
export function ChapterMenu({ chapters }: { chapters: Chapter[] }) {
  const { snapshot, execute } = useMedia(),
    { labels } = useMediaConfig();
  if (!snapshot.capabilities.seek || !chapters.length) return null;
  return (
    <Menu
      label={labels.chapters}
      items={chapters
        .filter((c) => Number.isFinite(c.start) && c.start >= 0)
        .map((c) => ({
          id: c.id,
          label: `${formatTime(c.start)} — ${c.title}`,
          onSelect: () => void execute({ type: "seek", time: c.start }),
        }))}
    />
  );
}
