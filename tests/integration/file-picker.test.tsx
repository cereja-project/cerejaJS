import { StrictMode, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { FilePicker, MediaPreview } from "../../packages/react/src";
import { useObjectUrl } from "../../packages/core/src";
test("selects removes and reselects the same local file", async () => {
  render(
    <FilePicker label="Escolher mídia" accept="audio/*" maxSizeBytes={100} />,
  );
  const file = new File(["data"], "track.mp3", { type: "audio/mpeg" }),
    input = screen.getByLabelText("Escolher mídia");
  await userEvent.upload(input, file);
  expect(screen.getByText("track.mp3")).toBeVisible();
  await userEvent.click(
    screen.getByRole("button", { name: "Remover track.mp3" }),
  );
  expect(screen.queryByText("track.mp3")).not.toBeInTheDocument();
  await userEvent.upload(input, file);
  expect(screen.getByText("track.mp3")).toBeVisible();
});
test("revokes object URLs on replacement and StrictMode unmount without returning a stale preview", async () => {
  let n = 0;
  const revoked: string[] = [];
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn(() => `blob:test-${++n}`),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    writable: true,
    value: vi.fn((url: string) => revoked.push(url)),
  });
  function Example({ file }: { file: File }) {
    const url = useObjectUrl(file);
    return <span data-testid="url">{url}</span>;
  }
  const a = new File(["a"], "a.mp3"),
    b = new File(["b"], "b.mp3");
  const { rerender, unmount } = render(
    <StrictMode>
      <Example file={a} />
    </StrictMode>,
  );
  await waitFor(() =>
    expect(screen.getByTestId("url").textContent).toMatch(/blob:/),
  );
  const first = screen.getByTestId("url").textContent!;
  expect(revoked).not.toContain(first);
  rerender(
    <StrictMode>
      <Example file={b} />
    </StrictMode>,
  );
  await waitFor(() =>
    expect(screen.getByTestId("url").textContent).not.toBe(first),
  );
  expect(revoked).toContain(first);
  const current = screen.getByTestId("url").textContent!;
  expect(revoked).not.toContain(current);
  unmount();
  expect(revoked).toContain(current);
});
test("does not execute HTML or infer informative image alternatives from filenames", () => {
  const { rerender, container } = render(
    <MediaPreview
      file={
        new File(["<script>alert(1)</script>"], "unsafe.html", {
          type: "text/html",
        })
      }
    />,
  );
  expect(container.querySelector("iframe,script,object,embed")).toBeNull();
  expect(screen.getByText("unsafe.html")).toBeVisible();
  rerender(
    <MediaPreview
      file={new File(["image"], "photo.png", { type: "image/png" })}
    />,
  );
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(
    screen.getByText(
      "Forneça um texto alternativo para visualizar esta imagem.",
    ),
  ).toBeVisible();
});
