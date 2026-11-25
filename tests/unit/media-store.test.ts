import { expect, test } from "vitest";
import { createMediaStore } from "../../packages/core/src/media/store";
import { controlledAdapter } from "../helpers/adapter";
import type { MediaAdapter } from "../../packages/core/src";

test("ignores late source completion and destroys the abandoned adapter exactly once", async () => {
  const store = createMediaStore(),
    host = document.createElement("div");
  const a = controlledAdapter(12),
    b = controlledAdapter(42);
  let resolveA!: (a: MediaAdapter) => void;
  const pending = store.attach(
    host,
    { type: "file", src: "/a" },
    "video",
    () =>
      new Promise((resolve) => {
        resolveA = resolve;
      }),
  );
  await store.attach(
    host,
    { type: "file", src: "/b" },
    "video",
    async () => b.adapter,
  );
  resolveA(a.adapter);
  await pending;
  a.update({ currentTime: 99 });
  expect(store.getSnapshot().currentTime).toBe(42);
  expect(a.destroyed).toBe(1);
  store.destroy();
  expect(b.destroyed).toBe(1);
  expect(b.listeners).toBe(0);
});
test("returns aborted for a command that resolves after source replacement", async () => {
  const store = createMediaStore(),
    a = controlledAdapter(),
    b = controlledAdapter();
  let done!: (x: { ok: true }) => void;
  a.adapter.execute = () =>
    new Promise((resolve) => {
      done = resolve;
    });
  await store.attach(
    document.createElement("div"),
    { type: "file", src: "/a" },
    "video",
    async () => a.adapter,
  );
  const command = store.execute({ type: "play" });
  await store.attach(
    document.createElement("div"),
    { type: "file", src: "/b" },
    "video",
    async () => b.adapter,
  );
  done({ ok: true });
  expect(await command).toMatchObject({
    ok: false,
    error: { code: "aborted" },
  });
});
test("is reusable after StrictMode cleanup and caches snapshots", async () => {
  const store = createMediaStore();
  store.destroy();
  await store.attach(
    document.createElement("div"),
    { type: "file", src: "/a" },
    "audio",
    async () => controlledAdapter(3).adapter,
  );
  expect(store.getSnapshot()).toBe(store.getSnapshot());
  expect(store.getSnapshot().currentTime).toBe(3);
});
test("normalizes a thrown adapter command into a visible snapshot error", async () => {
  const store = createMediaStore(),
    a = controlledAdapter();
  a.adapter.execute = async () => {
    throw new Error("Provider crashed");
  };
  await store.attach(
    document.createElement("div"),
    { type: "file", src: "/a" },
    "audio",
    async () => a.adapter,
  );
  expect(await store.execute({ type: "play" })).toMatchObject({
    ok: false,
    error: { code: "provider" },
  });
  expect(store.getSnapshot().error?.code).toBe("provider");
});
