import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { MediaRoot, MediaHost } from "../../packages/core/src";
import { Transcript } from "../../packages/react/src/player/Transcript";
import { controlledAdapter } from "../helpers/adapter";
const cues = [
  { id: "one", start: 0, end: 5, text: "Primeiro trecho" },
  { id: "two", start: 5, end: 10, text: "Segundo trecho" },
];
test("updates transcript without stealing focus and seeks only on activation", async () => {
  const a = controlledAdapter();
  render(
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/a" }}
      adapterFactory={async () => a.adapter}
    >
      <MediaHost />
      <input aria-label="Notas" />
      <Transcript cues={cues} />
    </MediaRoot>,
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: /Primeiro trecho/ }),
    ).toBeInTheDocument(),
  );
  const u = userEvent.setup();
  await u.click(screen.getByRole("textbox"));
  act(() => a.update({ currentTime: 6 }));
  expect(screen.getByRole("textbox")).toHaveFocus();
  expect(
    screen.getByRole("button", { name: /Segundo trecho/ }),
  ).toHaveAttribute("aria-current", "true");
  await u.click(screen.getByRole("button", { name: /Segundo trecho/ }));
  expect(a.commands).toEqual([{ type: "seek", time: 5 }]);
});
test("renders static text for a source that cannot seek and escapes transcript content", async () => {
  const a = controlledAdapter();
  a.update({
    capabilities: { ...a.adapter.getSnapshot().capabilities, seek: false },
  });
  const { container } = render(
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/a" }}
      adapterFactory={async () => a.adapter}
    >
      <MediaHost />
      <Transcript
        cues={[
          { id: "x", start: 0, end: 3, text: "<img src=x onerror=alert(1)>" },
        ]}
      />
    </MediaRoot>,
  );
  await waitFor(() =>
    expect(
      screen.getByText("<img src=x onerror=alert(1)>"),
    ).toBeInTheDocument(),
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
});
import { VideoPlayer } from "../../packages/react/src/player/VideoPlayer";
test("switches described version after readiness and preserves position and playback intention", async () => {
  const a = controlledAdapter(27),
    b = controlledAdapter(0);
  a.update({ status: "playing" });
  render(
    <VideoPlayer
      label="Descrição"
      source={{ type: "file", src: "/original" }}
      describedSource={{ type: "file", src: "/described" }}
      adapterFactory={async (o) =>
        "src" in o.source && o.source.src === "/described"
          ? b.adapter
          : a.adapter
      }
    />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: "Versão com audiodescrição" }),
  );
  await waitFor(() =>
    expect(b.commands).toEqual([{ type: "seek", time: 27 }, { type: "play" }]),
  );
  expect(a.destroyed).toBe(1);
});
test("waits for a described source seek window before restoring position", async () => {
  const a = controlledAdapter(27),
    b = controlledAdapter(0);
  const capabilities = b.adapter.getSnapshot().capabilities;
  b.update({
    status: "ready",
    seekable: [],
    capabilities: { ...capabilities, seek: false },
  });
  render(
    <VideoPlayer
      label="Restauração tardia"
      source={{ type: "file", src: "/original-late" }}
      describedSource={{ type: "file", src: "/described-late" }}
      adapterFactory={async (o) =>
        "src" in o.source && o.source.src === "/described-late"
          ? b.adapter
          : a.adapter
      }
    />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: "Versão com audiodescrição" }),
  );
  await waitFor(() => expect(a.destroyed).toBe(1));
  expect(b.commands).toEqual([]);
  act(() => b.update({ seekable: [{ start: 0, end: 100 }], capabilities }));
  await waitFor(() => expect(b.commands).toEqual([{ type: "seek", time: 27 }]));
});
test("does not resume automatically when restoring the described position fails", async () => {
  const a = controlledAdapter(27),
    b = controlledAdapter();
  a.update({ status: "playing" });
  b.adapter.execute = async (command) => {
    b.commands.push(command);
    return {
      ok: false,
      error: { code: "unsupported", message: "seek failed", recoverable: true },
    };
  };
  render(
    <VideoPlayer
      label="Falha de restauração"
      source={{ type: "file", src: "/original-error" }}
      describedSource={{ type: "file", src: "/described-error" }}
      adapterFactory={async (o) =>
        "src" in o.source && o.source.src === "/described-error"
          ? b.adapter
          : a.adapter
      }
    />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: "Versão com audiodescrição" }),
  );
  await waitFor(() => expect(b.commands).toEqual([{ type: "seek", time: 27 }]));
  expect(
    await screen.findByText(
      "Não foi possível restaurar a posição anterior nesta versão.",
    ),
  ).toBeInTheDocument();
});
test("moves focus from a removed retry button to the recovered play control", async () => {
  let calls = 0;
  const a = controlledAdapter();
  render(
    <VideoPlayer
      label="Repetir carregamento"
      source={{ type: "file", src: "/retry" }}
      adapterFactory={async () => {
        if (calls++ === 0) throw new Error("offline");
        return a.adapter;
      }}
    />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: "Tentar novamente" }),
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
  );
  expect(screen.getByRole("button", { name: "Reproduzir" })).toHaveFocus();
});
