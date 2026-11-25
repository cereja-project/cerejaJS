import { expect, test } from "vitest";
import { validateFiles } from "../../packages/core/src/files/validateFiles";
test("validates extensions MIME wildcards exact size and file count", () => {
  const a = new File(["1234"], "a.png", { type: "image/png" }),
    b = new File(["1234"], "b.jpg"),
    c = new File(["12345"], "c.mp3", { type: "audio/mpeg" });
  expect(
    validateFiles([a, b, c], {
      accept: "image/*",
      maxFiles: 2,
      maxSizeBytes: 4,
    }),
  ).toMatchObject({
    accepted: [a, b],
    rejected: [{ file: c, reason: "type" }],
  });
  expect(
    validateFiles([a, b], {
      accept: ".PNG,.jpg",
      maxFiles: 1,
      maxSizeBytes: 4,
    }),
  ).toMatchObject({ accepted: [a], rejected: [{ file: b, reason: "count" }] });
  expect(validateFiles([c], { maxSizeBytes: 4 })).toMatchObject({
    accepted: [],
    rejected: [{ reason: "size" }],
  });
  expect(() => validateFiles([a], { maxFiles: -1 })).toThrow();
});
