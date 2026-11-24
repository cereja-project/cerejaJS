import { test, expect } from "@playwright/test";
test("YouTube loads only after interaction and exposes its iframe", async ({
  page,
}) => {
  const requested: string[] = [];
  page.on("request", (r) => requested.push(r.url()));
  await page.goto(
    "/tests/fixtures/external.html?provider=youtube&id=" +
      (process.env.YOUTUBE_TEST_VIDEO_ID ?? "M7lc1UVf-VE"),
  );
  expect(requested.some((u) => /youtube(?:-nocookie)?\.com/.test(u))).toBe(
    false,
  );
  await page.getByRole("button", { name: "Carregar mídia" }).click();
  await expect(page.getByTitle("Vídeo incorporado")).toBeVisible({
    timeout: 30000,
  });
  await expect(
    page.getByRole("button", { name: "Reproduzir", exact: true }),
  ).toBeEnabled({ timeout: 30000 });
});
