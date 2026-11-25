import { Button } from "../primitives/Button";
import { useMediaConfig } from "../config";
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  const { labels } = useMediaConfig(),
    count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
  if (!count) return null;
  const current = Math.max(
    1,
    Math.min(count, Number.isFinite(page) ? Math.floor(page) : 1),
  );
  const pages = [...new Set([1, count, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  return (
    <nav aria-label={label ?? labels.pagination} className="md-pagination">
      <Button
        aria-label={labels.previousPage}
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
      >
        ‹
      </Button>
      {pages.map((p, i) => (
        <span key={p}>
          {i > 0 && p - pages[i - 1] > 1 && (
            <span className="md-pagination-gap" aria-hidden="true">
              …
            </span>
          )}
          <Button
            aria-label={`${labels.page} ${p}`}
            aria-current={p === current ? "page" : undefined}
            onClick={() => {
              if (p !== current) onPageChange(p);
            }}
          >
            {p}
          </Button>
        </span>
      ))}
      <Button
        aria-label={labels.nextPage}
        disabled={current >= count}
        onClick={() => onPageChange(current + 1)}
      >
        ›
      </Button>
    </nav>
  );
}
