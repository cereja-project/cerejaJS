import { test, expect } from "@playwright/test";
test("loads images and offers pan controls after zoom", async ({ page }) => {
  await page.goto("/tests/fixtures/components.html");
  await page.getByRole("button", { name: /Abrir imagem.*montanhas/ }).click();
  await expect(page.getByRole("dialog").getByRole("img")).toBeVisible();
  await page.getByRole("button", { name: "Ampliar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Mover para a direita" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Próxima", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("img")).toHaveAttribute(
    "alt",
    "Barco perto da praia.",
  );
});
