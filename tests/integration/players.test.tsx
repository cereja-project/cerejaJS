import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { MediaRoot, MediaHost } from "../../packages/core/src";
import { PlayerControls } from "../../packages/react/src/player/PlayerControls";
import { PlayerKeyboard } from "../../packages/react/src/player/PlayerKeyboard";
import { controlledAdapter } from "../helpers/adapter";
function mount(
  label: string,
  a: ReturnType<typeof controlledAdapter>,
  shortcuts = true,
) {
  return (
    <MediaRoot
      source={{ type: "file", src: "/" + label }}
      kind="video"
      adapterFactory={async () => a.adapter}
    >
      <PlayerKeyboard label={label} shortcuts={shortcuts}>
        <MediaHost />
        <PlayerControls />
        <input aria-label={"Notas " + label} />
      </PlayerKeyboard>
    </MediaRoot>
  );
}
test("keeps shortcuts local and leaves editable fields untouched", async () => {
  const a = controlledAdapter(),
    b = controlledAdapter();
  render(
    <>
      {mount("A", a)}
      {mount("B", b)}
    </>,
  );
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: "Reproduzir" })).toHaveLength(
      2,
    ),
  );
  fireEvent.keyDown(screen.getByRole("region", { name: "A" }), { key: "k" });
  await waitFor(() => expect(a.commands).toEqual([{ type: "play" }]));
  expect(b.commands).toEqual([]);
  const u = userEvent.setup();
  await u.type(screen.getByRole("textbox", { name: "Notas A" }), "k m");
  expect(a.commands).toHaveLength(1);
  expect(screen.getByRole("textbox", { name: "Notas A" })).toHaveValue("k m");
});
test("can disable shortcuts and removes controls as capabilities change", async () => {
  const a = controlledAdapter();
  render(mount("Player", a, false));
  await waitFor(() =>
    expect(screen.getByRole("slider", { name: "Volume" })).toBeInTheDocument(),
  );
  fireEvent.keyDown(screen.getByRole("region"), { key: "k" });
  expect(a.commands).toEqual([]);
  act(() =>
    a.update({
      capabilities: {
        ...a.adapter.getSnapshot().capabilities,
        volume: false,
        seek: false,
        rate: false,
      },
    }),
  );
  expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Velocidade" }),
  ).not.toBeInTheDocument();
});
test("reports blocked commands without pretending playback started", async () => {
  const a = controlledAdapter();
  a.adapter.execute = async () => ({
    ok: false,
    error: { code: "blocked", message: "Blocked", recoverable: true },
  });
  render(mount("Erro", a));
  await userEvent.click(
    await screen.findByRole("button", { name: "Reproduzir" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(/bloqueada/i);
  expect(
    screen.getByRole("button", { name: "Reproduzir" }),
  ).toBeInTheDocument();
});
test("reports errors from speed controls as well as the play button", async () => {
  const a = controlledAdapter();
  a.adapter.execute = async () => ({
    ok: false,
    error: { code: "network", message: "offline", recoverable: true },
  });
  render(mount("Falha de velocidade", a));
  const u = userEvent.setup();
  await u.click(await screen.findByRole("button", { name: "Velocidade" }));
  await u.click(screen.getByRole("menuitemcheckbox", { name: "1.5×" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    /Não foi possível/,
  );
});
test.each(["", "plaintext-only"])(
  "does not capture keys in contenteditable=%s descendants",
  async (mode) => {
    const a = controlledAdapter();
    render(
      <MediaRoot
        kind="video"
        source={{ type: "file", src: "/editable" }}
        adapterFactory={async () => a.adapter}
      >
        <PlayerKeyboard label="Editor">
          <MediaHost />
          <PlayerControls />
          <div
            contentEditable={mode as "plaintext-only"}
            suppressContentEditableWarning
          >
            <span data-testid="editable-child">Texto editável</span>
          </div>
        </PlayerKeyboard>
      </MediaRoot>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
    );
    fireEvent.keyDown(screen.getByTestId("editable-child"), { key: " " });
    fireEvent.keyDown(screen.getByTestId("editable-child"), { key: "k" });
    expect(a.commands).toEqual([]);
  },
);
test("offers pause during buffering when playback is active", async () => {
  const a = controlledAdapter();
  a.update({ status: "playing" });
  a.update({ status: "buffering" });
  render(mount("Buffering", a));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Pausar" })).toBeEnabled(),
  );
  await userEvent.click(screen.getByRole("button", { name: "Pausar" }));
  expect(a.commands).toEqual([{ type: "pause" }]);
});
test("guards control values against a custom adapter returning non-finite metadata", async () => {
  const a = controlledAdapter();
  a.update({
    currentTime: Infinity,
    duration: Infinity,
    volume: NaN,
    playbackRate: NaN,
    seekable: [{ start: 0, end: Infinity }],
  });
  render(mount("Metadados inválidos", a));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
  );
  expect(
    screen.queryByRole("slider", { name: "Posição da reprodução" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
    "aria-valuetext",
    "100%",
  );
  expect(
    screen.getByRole("region", { name: "Metadados inválidos" }),
  ).not.toHaveTextContent(/NaN|Infinity/);
});
test("lists only speeds that both provider and application support", async () => {
  const a = controlledAdapter();
  a.update({ availablePlaybackRates: [1, 1.5] } as Partial<
    ReturnType<typeof a.adapter.getSnapshot>
  >);
  render(mount("Velocidades disponíveis", a));
  const u = userEvent.setup();
  await u.click(await screen.findByRole("button", { name: "Velocidade" }));
  expect(
    screen.getByRole("menuitemcheckbox", { name: "1.5×" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("menuitemcheckbox", { name: "0.5×" }),
  ).not.toBeInTheDocument();
});
