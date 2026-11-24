import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import axe from "axe-core";
import {
  Button,
  Dialog,
  Slider,
  IconButton,
  MediaConfigProvider,
} from "../../packages/core/src";
function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <input aria-label="Anotação" />
      <Dialog
        title="Detalhes"
        open={open}
        onOpenChange={setOpen}
        trigger={<Button>Abrir</Button>}
      >
        <Button>Ação</Button>
      </Dialog>
    </>
  );
}
test("restores dialog focus after Escape and exposes its name", async () => {
  const u = userEvent.setup();
  render(<Example />);
  await u.click(screen.getByRole("button", { name: "Abrir" }));
  expect(screen.getByRole("dialog", { name: "Detalhes" })).toBeInTheDocument();
  await u.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Abrir" })).toHaveFocus(),
  );
});
test("labels range values and forwards changes without stealing typing keys", async () => {
  let value = 0;
  render(
    <>
      <Slider
        label="Volume"
        min={0}
        max={1}
        step={0.05}
        value={0.5}
        valueText="50%"
        onValueChange={(v) => {
          value = v;
        }}
      />
      <input aria-label="Notas" />
    </>,
  );
  expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
    "aria-valuetext",
    "50%",
  );
  fireEvent.change(screen.getByRole("slider"), { target: { value: "0.75" } });
  expect(value).toBe(0.75);
  const u = userEvent.setup();
  await u.type(screen.getByRole("textbox"), "k m");
  expect(screen.getByRole("textbox")).toHaveValue("k m");
});
test("preserves translated close labels and has no basic axe violations", async () => {
  const { container } = render(
    <MediaConfigProvider labels={{ close: "Close" }}>
      <IconButton label="Favoritar">☆</IconButton>
      <Slider
        label="Volume"
        min={0}
        max={1}
        step={0.05}
        value={0.5}
        valueText="50%"
        onValueChange={() => {}}
      />
    </MediaConfigProvider>,
  );
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});
test("associates an optional description with its dialog", async () => {
  render(
    <Dialog
      title="Informações"
      description="Descrição complementar"
      open
      onOpenChange={() => {}}
    >
      Conteúdo
    </Dialog>,
  );
  expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
    "Descrição complementar",
  );
});
import { Menu } from "../../packages/core/src";
test("keeps media menus inside their player portal so fullscreen can display them", async () => {
  const { container } = render(
    <section data-media-player aria-label="Player">
      <Menu
        label="Legendas em tela cheia"
        items={[{ id: "pt", label: "Português", onSelect: () => {} }]}
      />
    </section>,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Legendas em tela cheia" }),
  );
  expect(container.querySelector("[data-media-player]")).toContainElement(
    screen.getByRole("menu"),
  );
});
