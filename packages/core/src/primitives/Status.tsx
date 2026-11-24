import type { ReactNode } from "react";
export function Status({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <p
      className="md-status"
      role={error ? "alert" : "status"}
      aria-atomic="true"
    >
      {children}
    </p>
  );
}
