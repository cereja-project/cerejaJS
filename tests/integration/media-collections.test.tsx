import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { MediaGrid, MediaList, Button } from "../../packages/react/src";
const items = [
  { id: "a", title: "Áudio A" },
  { id: "b", title: "Vídeo B" },
];
test("selection does not activate the independent open action", async () => {
  let opened = 0,
    selected: string[] = [];
  render(
    <MediaGrid
      items={items}
      selectedIds={[]}
      onSelectionChange={(ids) => {
        selected = ids;
      }}
      renderAction={(item) => (
        <Button onClick={() => opened++}>Abrir {item.title}</Button>
      )}
    />,
  );
  await userEvent.click(
    screen.getByRole("checkbox", { name: "Selecionar Áudio A" }),
  );
  expect(selected).toEqual(["a"]);
  expect(opened).toBe(0);
  await userEvent.click(screen.getByRole("button", { name: "Abrir Áudio A" }));
  expect(opened).toBe(1);
  expect(document.querySelector("button button,button input")).toBeNull();
});
test("selection callbacks discard IDs absent from the current collection", async () => {
  let selected: string[] = [];
  render(
    <MediaList
      items={[items[1]]}
      selectedIds={["a"]}
      onSelectionChange={(ids) => {
        selected = ids;
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("checkbox", { name: "Selecionar Vídeo B" }),
  );
  expect(selected).toEqual(["b"]);
});
test("empty media collections show an explicit empty state", () => {
  render(<MediaGrid items={[]} />);
  expect(screen.getByText("Nenhuma mídia disponível")).toBeVisible();
});
