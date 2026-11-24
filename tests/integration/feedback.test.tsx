import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Alert, Progress, Skeleton, EmptyState } from "../../packages/core/src";
test("static alerts do not announce but explicitly announced errors do", () => {
  const { rerender } = render(<Alert title="Informação">Texto</Alert>);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  rerender(
    <Alert title="Erro" tone="error" announce="assertive">
      Falhou
    </Alert>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Falhou");
});
test("progress has named determinate and indeterminate modes", () => {
  const { rerender } = render(<Progress label="Processando" />);
  expect(
    screen.getByRole("progressbar", { name: "Processando" }),
  ).not.toHaveAttribute("value");
  rerender(<Progress label="Processando" value={150} max={100} />);
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "100");
});
test("skeleton is decorative and loading state is named once", () => {
  const { container } = render(
    <>
      <Skeleton label="Carregando itens" />
      <EmptyState title="Sem itens" description="Adicione um arquivo" />
    </>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("Carregando itens");
  expect(container.querySelector(".md-skeleton")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(screen.getByText("Sem itens")).toBeVisible();
});
