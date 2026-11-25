import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { Gallery } from "../../packages/react/src/images/Gallery";
import { Image } from "../../packages/react/src/images/Image";
const images = [
  {
    id: "a",
    src: "/a.svg",
    alt: "Praia ao amanhecer",
    caption: "Primeira imagem",
  },
  { id: "b", src: "/b.svg", alt: "Barco no mar" },
];
test("opens an image with keyboard, zooms with a button and returns focus", async () => {
  render(<Gallery items={images} />);
  const u = userEvent.setup();
  const trigger = screen.getByRole("button", { name: /Abrir imagem.*Praia/ });
  trigger.focus();
  await u.keyboard("{Enter}");
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
  await u.click(screen.getByRole("button", { name: "Ampliar" }));
  expect(screen.getByText("125%")).toBeInTheDocument();
  await u.keyboard("{Escape}");
  await waitFor(() => expect(trigger).toHaveFocus());
});
test("restores focus to gallery when the open item is removed", async () => {
  const { rerender } = render(<Gallery items={images} />);
  await userEvent.click(
    screen.getByRole("button", { name: /Abrir imagem.*Praia/ }),
  );
  rerender(<Gallery items={[images[1]]} />);
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.getByRole("region", { name: "Galeria" })).toHaveFocus(),
  );
});
test("uses empty alt only for decorative images and exposes image loading errors", () => {
  const { container } = render(
    <>
      <Image image={{ id: "d", src: "/d", decorative: true }} />
      <Image image={images[0]} />
    </>,
  );
  expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
  fireEvent.error(screen.getByRole("img", { name: "Praia ao amanhecer" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Não foi possível carregar a imagem.",
  );
});
import { useState } from "react";
import { ImageViewer } from "../../packages/react/src/images/ImageViewer";
function Standalone({ showOpener }: { showOpener: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      {showOpener && (
        <button onClick={() => setActive("a")}>Abrir independente</button>
      )}
      <ImageViewer
        items={images}
        activeId={active}
        onActiveChange={setActive}
      />
    </>
  );
}
test("standalone viewer has a visible focus fallback when its opener disappears", async () => {
  const { rerender } = render(<Standalone showOpener />);
  await userEvent.click(
    screen.getByRole("button", { name: "Abrir independente" }),
  );
  rerender(<Standalone showOpener={false} />);
  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("group", { name: "Visualizador de imagens" }),
    ).toHaveFocus(),
  );
  expect(
    screen.getByRole("group", { name: "Visualizador de imagens" }),
  ).toBeVisible();
});
