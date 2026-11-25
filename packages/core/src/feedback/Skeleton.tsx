import type { CSSProperties } from "react";
export function Skeleton({
  label,
  width = "100%",
  height = "1rem",
}: {
  label?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}) {
  return (
    <div className="md-skeleton-container">
      <div
        className="md-skeleton"
        style={{ width, height }}
        aria-hidden="true"
      />
      {label && (
        <span role="status" className="md-loading-label">
          {label}
        </span>
      )}
    </div>
  );
}
