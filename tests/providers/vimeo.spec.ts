import { test, expect } from "@playwright/test";
test("Vimeo loads only after interaction and becomes ready", async ({
  page,
}) => {
  const requested: string[] = [];
  page.on("request", (r) => requested.push(r.url()));
  await page.goto(
    "/tests/fixtures/external.html?provider=vimeo&id=" +
      (process.env.VIMEO_TEST_VIDEO_ID ?? "76979871"),
  );
  expect(requested.some((u) => /vimeo\.com/.test(u))).toBe(false);
  await page.getByRole("button", { name: "Carregar mídia" }).click();
  await expect(page.getByTitle("Vídeo incorporado")).toBeVisible({
    timeout: 30000,
  });
  await expect(
    page.getByRole("button", { name: "Reproduzir", exact: true }),
  ).toBeEnabled({ timeout: 30000 });
});
