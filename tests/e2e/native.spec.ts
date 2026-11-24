import { test, expect } from "@playwright/test";
test("native video actually plays, pauses and seeks", async ({ page }) => {
  await page.goto("/tests/fixtures/native.html");
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.readyState),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Reproduzir" }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0.2);
  await page.getByRole("button", { name: "Pausar" }).click();
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
  ).toBe(true);
  await page.getByRole("button", { name: "Ir a 5 segundos" }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeCloseTo(5, 0);
});
