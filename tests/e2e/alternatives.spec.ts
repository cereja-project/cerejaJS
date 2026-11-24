import { test, expect } from "@playwright/test";
test("real WebVTT track loads and transcript remains keyboard navigable", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/components.html");
  await expect(
    page.getByRole("button", { name: "Legendas", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Legendas", exact: true }).click();
  await page
    .getByRole("menuitemcheckbox", { name: "Português", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((v: HTMLVideoElement) =>
          Array.from(v.textTracks).some((t) => t.mode === "showing"),
        ),
    )
    .toBe(true);
  await page.getByRole("button", { name: /Um tom acompanha/ }).focus();
  await expect(
    page.getByRole("button", { name: /Um tom acompanha/ }),
  ).toBeFocused();
});
