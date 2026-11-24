import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import {
  MediaLoading,
  MediaUnavailable,
  MediaErrorState,
} from "../../packages/react/src";
test("media error recovery has a real action and non-action states have no fake buttons", async () => {
  let calls = 0;
  const { rerender } = render(<MediaErrorState onRetry={() => calls++} />);
  await userEvent.click(
    screen.getByRole("button", { name: "Tentar novamente" }),
  );
  expect(calls).toBe(1);
  rerender(<MediaUnavailable />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  rerender(<MediaLoading label="Carregando biblioteca" />);
  expect(screen.getAllByRole("status")).toHaveLength(1);
  expect(screen.getByRole("status")).toHaveTextContent("Carregando biblioteca");
});
import { vi } from "vitest";
import { Image, type ImageData } from "../../packages/react/src";
test("missing-alt warnings are restricted to development mode", () => {
  vi.stubEnv("DEV", false);
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  try {
    render(
      <Image image={{ id: "bad", src: "/bad" } as unknown as ImageData} />,
    );
    expect(warn).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllEnvs();
  }
});
