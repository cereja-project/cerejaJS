import type { ReactNode } from "react";
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="md-empty">
      <p className="md-empty-title">{title}</p>
      {description && <p>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
