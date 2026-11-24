import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../../apps/docs/src/App";
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
});
test("catalog can find and open an individual component with variations and API", async () => {
  render(<App />);
  const u = userEvent.setup();
  await u.type(
    screen.getByRole("searchbox", { name: "Buscar componentes" }),
    "Switch",
  );
  await u.click(screen.getByRole("button", { name: "Ver Switch" }));
  expect(
    screen.getByRole("heading", { level: 1, name: "Switch" }),
  ).toBeVisible();
  await u.selectOptions(
    screen.getByRole("combobox", { name: "Variação" }),
    "disabled",
  );
  expect(screen.getByRole("switch")).toBeDisabled();
  expect(screen.getByRole("heading", { name: "API" })).toBeVisible();
});
test("complete form demonstrates error summary focus links and a valid local confirmation", async () => {
  render(<App />);
  const u = userEvent.setup();
  await u.click(screen.getByRole("button", { name: "Exemplos completos" }));
  await u.click(
    screen.getByRole("button", { name: "Abrir Formulário acessível" }),
  );
  await u.click(screen.getByRole("button", { name: "Preparar mensagem" }));
  const summary = screen.getByRole("alert");
  expect(summary).toHaveFocus();
  await u.click(
    within(summary).getByRole("link", { name: "Informe seu nome." }),
  );
  expect(screen.getByRole("textbox", { name: "Nome" })).toHaveFocus();
  await u.type(screen.getByRole("textbox", { name: "Nome" }), "Ana");
  await u.type(
    screen.getByRole("textbox", { name: "Email" }),
    "ana@example.com",
  );
  await u.click(screen.getByRole("checkbox", { name: /Aceito/ }));
  await u.click(screen.getByRole("button", { name: "Preparar mensagem" }));
  expect(screen.getByText("Mensagem preparada localmente")).toBeVisible();
});
