import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("form summary moves focus and links lead to invalid fields", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/catalog.html");
  await page
    .getByRole("button", { name: "Exemplos completos", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Abrir Formulário acessível", exact: true })
    .click();
  await page.getByRole("button", { name: "Preparar mensagem" }).click();
  await expect(page.getByRole("alert")).toBeFocused();
  await page.getByRole("link", { name: "Informe seu nome." }).click();
  await expect(
    page.getByRole("textbox", { name: "Nome", exact: true }),
  ).toBeFocused();
  await page.getByRole("textbox", { name: "Nome", exact: true }).fill("Ana");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("ana@example.com");
  await page.getByRole("checkbox", { name: /Aceito/ }).check();
  await page.getByRole("button", { name: "Preparar mensagem" }).click();
  await expect(page.getByText("Mensagem preparada localmente")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("tabs and comparison work with keyboard and visible buttons", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/catalog.html");
  await page.getByRole("button", { name: "Ver Tabs", exact: true }).click();
  const first = page.getByRole("tab", { name: "Descrição", exact: true });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Informações", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("tabpanel", { name: "Informações", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "ImageComparison", exact: true })
    .click();
  await page.getByRole("slider", { name: "Posição da comparação" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("slider", { name: "Posição da comparação" }),
  ).toHaveValue("51");
  await page.getByRole("button", { name: "Lado a lado" }).click();
  await expect(
    page.getByRole("button", { name: "Lado a lado" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("local image preview uses an object URL and no upload request", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });
  await page.goto("/tests/fixtures/catalog.html");
  await page
    .getByRole("button", { name: "Exemplos completos", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Abrir Arquivos locais", exact: true })
    .click();
  await page
    .getByLabel("Adicionar arquivos locais", { exact: true })
    .setInputFiles({
      name: "pixel.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/a9sAAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await page
    .getByRole("textbox", { name: "Texto alternativo da imagem", exact: true })
    .fill("Um pixel de demonstração");
  await expect(
    page.getByRole("img", { name: "Um pixel de demonstração" }),
  ).toHaveAttribute("src", /^blob:/);
  expect(posts).toEqual([]);
});
