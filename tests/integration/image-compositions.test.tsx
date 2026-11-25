import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { Carousel, ImageComparison } from "../../packages/react/src";
const images = [
  { id: "one", src: "/one", alt: "Primeira paisagem" },
  { id: "two", src: "/two", alt: "Segunda paisagem" },
];
test("manual carousel exposes one image at a time with bounded navigation", async () => {
  const { rerender } = render(<Carousel label="Paisagens" items={images} />);
  expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
  expect(screen.getByRole("img", { name: "Primeira paisagem" })).toBeVisible();
  expect(
    screen.queryByRole("img", { name: "Segunda paisagem" }),
  ).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  expect(screen.getByRole("img", { name: "Segunda paisagem" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  rerender(<Carousel label="Paisagens" items={[images[0]]} />);
  expect(screen.getByRole("img", { name: "Primeira paisagem" })).toBeVisible();
});
test("comparison offers buttons range and a side-by-side alternative", async () => {
  render(
    <ImageComparison label="Comparar" before={images[0]} after={images[1]} />,
  );
  expect(
    screen.getByRole("slider", { name: "Posição da comparação" }),
  ).toHaveValue("50");
  await userEvent.click(
    screen.getByRole("button", { name: "Mostrar mais da imagem anterior" }),
  );
  expect(screen.getByRole("slider")).toHaveValue("60");
  await userEvent.click(screen.getByRole("button", { name: "Lado a lado" }));
  expect(screen.getByRole("button", { name: "Lado a lado" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    screen.getByRole("img", { name: "Primeira paisagem" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Segunda paisagem" }),
  ).toBeInTheDocument();
});
