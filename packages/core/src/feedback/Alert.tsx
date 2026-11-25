import { useId, type ReactNode } from "react";
export function Alert({
  children,
  title,
  tone = "info",
  announce = "off",
}: {
  children: ReactNode;
  title?: string;
  tone?: "info" | "success" | "warning" | "error";
  announce?: "off" | "polite" | "assertive";
}) {
  const id = useId();
  return (
    <div
      className={`md-alert md-alert-${tone}`}
      role={
        announce === "assertive"
          ? "alert"
          : announce === "polite"
            ? "status"
            : undefined
      }
      aria-labelledby={title ? id : undefined}
    >
      <span className="md-alert-symbol" aria-hidden="true">
        {tone === "error" ? "!" : tone === "success" ? "✓" : "i"}
      </span>
      <div>
        {title && (
          <p className="md-alert-title" id={id}>
            {title}
          </p>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
