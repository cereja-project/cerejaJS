import { test, expect } from "@playwright/test";
test("ready player confirms play and pause using actual video state", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/components.html");
  await page.getByRole("button", { name: "Reproduzir", exact: true }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0.1);
  await page.getByRole("button", { name: "Pausar", exact: true }).click();
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.paused),
  ).toBe(true);
});
