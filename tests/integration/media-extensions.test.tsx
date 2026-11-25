import { useState } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { MediaRoot, MediaHost } from "../../packages/core/src";
import {
  TranscriptSearch,
  ChapterList,
  SeekBackButton,
  SeekForwardButton,
  MediaSourcePlayer,
} from "../../packages/react/src";
import { controlledAdapter } from "../helpers/adapter";
const cues = [
  { id: "a", start: 0, end: 5, text: "Áudio acessível" },
  { id: "b", start: 5, end: 10, text: "Vídeo com descrição" },
];
test("search finds normalized text and reports empty results without moving focus", async () => {
  const a = controlledAdapter();
  render(
    <MediaRoot
      kind="audio"
      source={{ type: "file", src: "/a" }}
      adapterFactory={async () => a.adapter}
    >
      <MediaHost />
      <TranscriptSearch cues={cues} />
    </MediaRoot>,
  );
  const input = screen.getByRole("searchbox", {
    name: "Buscar na transcrição",
  });
  await userEvent.type(input, "audio");
  expect(
    await screen.findByRole("button", { name: /Áudio acessível/ }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /Vídeo com descrição/ }),
  ).not.toBeInTheDocument();
  expect(input).toHaveFocus();
  await userEvent.clear(input);
  await userEvent.type(input, "inexistente");
  expect(screen.getByText("Nenhum trecho encontrado")).toBeVisible();
  expect(input).toHaveFocus();
});
test("jump buttons respect capabilities and chapters become text without seek", async () => {
  const a = controlledAdapter(20);
  render(
    <MediaRoot
      kind="video"
      source={{ type: "file", src: "/a" }}
      adapterFactory={async () => a.adapter}
    >
      <MediaHost />
      <SeekBackButton />
      <SeekForwardButton seconds={10} />
      <ChapterList chapters={[{ id: "c", start: 0, title: "Introdução" }]} />
    </MediaRoot>,
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Retroceder/ })).toBeEnabled(),
  );
  await userEvent.click(screen.getByRole("button", { name: /Retroceder/ }));
  await userEvent.click(screen.getByRole("button", { name: /Avançar/ }));
  expect(a.commands).toEqual([
    { type: "seek", time: 15 },
    { type: "seek", time: 30 },
  ]);
  act(() =>
    a.update({
      capabilities: { ...a.adapter.getSnapshot().capabilities, seek: false },
    }),
  );
  expect(screen.getByRole("button", { name: /Retroceder/ })).toBeDisabled();
  expect(
    screen.queryByRole("button", { name: /Introdução/ }),
  ).not.toBeInTheDocument();
  expect(screen.getByText(/Introdução/)).toBeVisible();
});
test("source selection preserves paused position after the new seek window arrives", async () => {
  const a = controlledAdapter(27),
    b = controlledAdapter();
  const capabilities = b.adapter.getSnapshot().capabilities;
  b.update({ seekable: [], capabilities: { ...capabilities, seek: false } });
  function Example() {
    const [value, setValue] = useState("a");
    return (
      <MediaSourcePlayer
        label="Fontes"
        value={value}
        onValueChange={setValue}
        sources={[
          { id: "a", label: "Original", source: { type: "file", src: "/a" } },
          {
            id: "b",
            label: "Alternativa",
            source: { type: "file", src: "/b" },
          },
        ]}
        adapterFactory={async (o) =>
          "src" in o.source && o.source.src === "/b" ? b.adapter : a.adapter
        }
      />
    );
  }
  render(<Example />);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Fonte de mídia" }),
    "b",
  );
  await waitFor(() => expect(a.destroyed).toBe(1));
  act(() => b.update({ seekable: [{ start: 0, end: 100 }], capabilities }));
  await waitFor(() => expect(b.commands).toEqual([{ type: "seek", time: 27 }]));
});
import { CompactAudioPlayer } from "../../packages/react/src";
test("ready-made players allow composed alternatives inside the same media context", async () => {
  const a = controlledAdapter();
  render(
    <CompactAudioPlayer
      label="Podcast"
      source={{ type: "file", src: "/podcast" }}
      adapterFactory={async () => a.adapter}
    >
      <TranscriptSearch cues={cues} />
    </CompactAudioPlayer>,
  );
  await waitFor(() =>
    expect(
      screen.getByRole("searchbox", { name: "Buscar na transcrição" }),
    ).toBeVisible(),
  );
});

test("source selection retains focus when audio description is available", async () => {
  const a = controlledAdapter(27),
    b = controlledAdapter();
  function Example() {
    const [value, setValue] = useState("a");
    return (
      <MediaSourcePlayer
        label="Fontes"
        value={value}
        onValueChange={setValue}
        describedSource={{ type: "file", src: "/described" }}
        sources={[
          { id: "a", label: "Original", source: { type: "file", src: "/a" } },
          {
            id: "b",
            label: "Alternativa",
            source: { type: "file", src: "/b" },
          },
        ]}
        adapterFactory={async (o) =>
          "src" in o.source && o.source.src === "/b" ? b.adapter : a.adapter
        }
      />
    );
  }
  render(<Example />);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
  );
  const select = screen.getByRole("combobox", { name: "Fonte de mídia" });
  select.focus();
  await userEvent.selectOptions(select, "b");
  await waitFor(() => expect(a.destroyed).toBe(1));
  expect(select).toHaveFocus();
});
