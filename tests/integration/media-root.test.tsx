import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { MediaRoot, MediaHost, useMedia } from "../../packages/core/src";
import { controlledAdapter } from "../helpers/adapter";
function Status() {
  return <output>{useMedia().snapshot.currentTime}</output>;
}
test("survives StrictMode and unmount without retaining subscriptions", async () => {
  const adapters: ReturnType<typeof controlledAdapter>[] = [];
  const factory = async () => {
    const a = controlledAdapter(9);
    adapters.push(a);
    return a.adapter;
  };
  const tree = (
    <StrictMode>
      <MediaRoot
        source={{ type: "file", src: "/test" }}
        kind="audio"
        adapterFactory={factory}
      >
        <MediaHost />
        <Status />
      </MediaRoot>
    </StrictMode>
  );
  expect(renderToString(tree)).toContain("0");
  const { unmount } = render(tree);
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("9"),
  );
  unmount();
  expect(adapters.every((a) => a.listeners === 0 && a.destroyed === 1)).toBe(
    true,
  );
});
import { act } from "@testing-library/react";
test("notifies onError once per distinct error instead of once per clock tick", async () => {
  const a = controlledAdapter();
  let count = 0;
  render(
    <MediaRoot
      source={{ type: "file", src: "/error" }}
      kind="audio"
      adapterFactory={async () => a.adapter}
      onError={() => {
        count++;
      }}
    >
      <MediaHost />
      <Status />
    </MediaRoot>,
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("0"),
  );
  await act(async () => {
    await Promise.resolve();
  });
  act(() =>
    a.update({
      error: { code: "network", message: "offline", recoverable: true },
    }),
  );
  act(() => a.update({ currentTime: 4 }));
  expect(count).toBe(1);
});
