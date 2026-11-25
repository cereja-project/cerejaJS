import { test, expect } from "@playwright/test";
for (const type of ["hls", "dash"])
  test(`${type} plays real segments`, async ({ page }) => {
    await page.goto(`/tests/fixtures/streaming.html?type=${type}`);
    await expect(
      page.getByRole("button", { name: "Reproduzir", exact: true }),
    ).toBeEnabled({ timeout: 20000 });
    await page.getByRole("button", { name: "Reproduzir", exact: true }).click();
    await expect
      .poll(
        () =>
          page
            .locator("video")
            .evaluate((v: HTMLVideoElement) => v.currentTime),
        { timeout: 20000 },
      )
      .toBeGreaterThan(0.5);
  });
test("live manifest slides its window and exposes live navigation", async ({
  page,
}) => {
  await page.goto(
    "/tests/fixtures/streaming.html?live=1&session=" + Date.now(),
  );
  await expect(
    page.getByRole("button", { name: "Voltar ao vivo" }),
  ).toBeVisible({ timeout: 20000 });
  await page.getByRole("button", { name: "Reproduzir", exact: true }).click();
  await expect
    .poll(
      () =>
        page
          .locator("video")
          .evaluate((v: HTMLVideoElement) =>
            v.seekable.length ? v.seekable.start(0) : 0,
          ),
      { timeout: 20000 },
    )
    .toBeGreaterThan(0);
});
