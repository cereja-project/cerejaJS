import { expect, test } from "vitest";
import { getLiveTarget } from "../../packages/providers/src/live";
import { clampToRanges } from "../../packages/providers/src/native";
import { controlledAdapter } from "../helpers/adapter";
test("does not expose a live target without a DVR window", () => {
  const a = controlledAdapter();
  a.update({ live: true, seekable: [] });
  expect(getLiveTarget(a.adapter.getSnapshot())).toBeNull();
});
test("uses the live edge of a moving window and clamps seeks in gaps", () => {
  const a = controlledAdapter();
  a.update({
    live: true,
    seekable: [
      { start: 20, end: 30 },
      { start: 40, end: 50 },
    ],
  });
  expect(getLiveTarget(a.adapter.getSnapshot())).toBe(50);
  expect(clampToRanges(0, a.adapter.getSnapshot().seekable)).toBe(20);
  expect(clampToRanges(35, a.adapter.getSnapshot().seekable)).toBe(30);
  expect(clampToRanges(NaN, a.adapter.getSnapshot().seekable)).toBeNull();
});
