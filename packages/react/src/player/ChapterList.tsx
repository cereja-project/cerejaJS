import { Button, useMedia, useMediaConfig, type Chapter } from "@cereja-project/ui-core";
import { formatTime } from "./format";
export function ChapterList({ chapters }: { chapters: Chapter[] }) {
  const { snapshot: s, execute } = useMedia(),
    { labels } = useMediaConfig();
  const valid = chapters
    .filter((c) => Number.isFinite(c.start) && c.start >= 0)
    .sort((a, b) => a.start - b.start);
  return (
    <nav aria-label={labels.chapters} className="md-chapter-list">
      <ol>
        {valid.map((c, i) => (
          <li key={c.id}>
            {s.capabilities.seek ? (
              <Button
                aria-current={
                  s.currentTime >= c.start &&
                  (i === valid.length - 1 || s.currentTime < valid[i + 1].start)
                    ? "true"
                    : undefined
                }
                onClick={() => void execute({ type: "seek", time: c.start })}
              >
                {formatTime(c.start)} — {c.title}
              </Button>
            ) : (
              <span>
                {formatTime(c.start)} — {c.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
