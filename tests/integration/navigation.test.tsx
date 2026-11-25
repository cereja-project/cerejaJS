import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import {
  Tabs,
  Accordion,
  Breadcrumbs,
  Pagination,
} from "../../packages/core/src";
test("tabs navigate manually with arrows and keep inactive panels hidden", async () => {
  render(
    <Tabs
      label="Mídia"
      items={[
        { value: "a", label: "Áudio", content: <button>Ação áudio</button> },
        { value: "b", label: "Vídeo", content: <button>Ação vídeo</button> },
        { value: "c", label: "Bloqueado", content: "Nada", disabled: true },
      ]}
    />,
  );
  const u = userEvent.setup();
  screen.getByRole("tab", { name: "Áudio" }).focus();
  await u.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Vídeo" })).toHaveFocus();
  expect(
    screen.queryByRole("button", { name: "Ação vídeo" }),
  ).not.toBeInTheDocument();
  await u.keyboard("{Enter}");
  expect(screen.getByRole("tab", { name: "Vídeo" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getByRole("button", { name: "Ação vídeo" })).toBeVisible();
  await u.keyboard("{End}");
  expect(screen.getByRole("tab", { name: "Vídeo" })).toHaveFocus();
});
test("accordion exposes expanded state and breadcrumb current page", async () => {
  render(
    <>
      <Accordion
        items={[
          { id: "one", title: "Detalhes", content: "Conteúdo útil" },
          {
            id: "two",
            title: "Indisponível",
            content: "Oculto",
            disabled: true,
          },
        ]}
      />
      <Breadcrumbs
        items={[{ label: "Início", href: "/" }, { label: "Galeria" }]}
      />
    </>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Detalhes" }));
  expect(screen.getByRole("button", { name: "Detalhes" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(screen.getByText("Conteúdo útil")).toBeVisible();
  expect(screen.getByText("Galeria")).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("button", { name: "Indisponível" })).toBeDisabled();
});
test("pagination normalizes empty or shortened datasets and bounds controls", async () => {
  let page = 1;
  const { rerender } = render(
    <Pagination
      page={1}
      pageCount={20}
      onPageChange={(v) => {
        page = v;
      }}
    />,
  );
  const nav = screen.getByRole("navigation", { name: "Paginação" });
  expect(
    within(nav).getByRole("button", { name: "Página anterior" }),
  ).toBeDisabled();
  await userEvent.click(
    within(nav).getByRole("button", { name: "Próxima página" }),
  );
  expect(page).toBe(2);
  expect(within(nav).getAllByRole("button").length).toBeLessThan(12);
  rerender(<Pagination page={20} pageCount={2} onPageChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Página 2" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  rerender(<Pagination page={2} pageCount={0} onPageChange={() => {}} />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
