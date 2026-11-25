import type { MediaLabels } from "@cereja-project/ui-core";
export function formatTime(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const h = Math.floor(seconds / 3600),
    m = Math.floor((seconds % 3600) / 60),
    s = seconds % 60;
  return `${h ? h + ":" : ""}${h ? String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
}
export function timeDescription(value: number, labels: MediaLabels) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return `${Math.floor(seconds / 3600)} ${labels.hours}, ${Math.floor((seconds % 3600) / 60)} ${labels.minutes}, ${seconds % 60} ${labels.seconds}`;
}
