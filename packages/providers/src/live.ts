import type { MediaSnapshot } from "@cereja-project/ui-core";
export function getLiveTarget(snapshot: MediaSnapshot): number | null {
  if (!snapshot.live || !snapshot.capabilities.seek) return null;
  const last = snapshot.seekable
    .filter(
      (r) =>
        Number.isFinite(r.start) && Number.isFinite(r.end) && r.end > r.start,
    )
    .at(-1);
  return last?.end ?? null;
}
