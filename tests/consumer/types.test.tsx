import { expectTypeOf, test } from "vitest";
import type {
  MediaSource,
  ImageData,
  CommandResult,
} from "../../packages/core/src/index";

test("requires an explicit source type and image alternative", () => {
  expectTypeOf<MediaSource>().not.toMatchTypeOf<string>();
  const signed: MediaSource = {
    type: "file",
    src: "https://example.com/signed?token=123",
  };
  const decorative: ImageData = { id: "d", src: "/d.svg", decorative: true };
  // @ts-expect-error A URL alone does not identify a provider.
  const invalidSource: MediaSource = { src: "/video" };
  // @ts-expect-error Informative images must have an alternative.
  const missingAlt: ImageData = { id: "i", src: "/i.svg" };
  // @ts-expect-error Decorative images cannot have competing alternative text.
  const conflictingAlt: ImageData = {
    id: "i",
    src: "/i.svg",
    decorative: true,
    alt: "Informative",
  };
  expectTypeOf<CommandResult>().toMatchTypeOf<{ ok: boolean }>();
  void [signed, decorative, invalidSource, missingAlt, conflictingAlt];
});
