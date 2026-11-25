import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("compositions pass axe with native media controls and visible focus", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/components.html");
  await expect(
    page.getByRole("button", { name: "Reproduzir", exact: true }),
  ).toBeEnabled();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  const volume = page.getByRole("slider", { name: "Volume", exact: true });
  await volume.focus();
  const before = await volume.inputValue();
  await page.keyboard.press("ArrowLeft");
  await expect(volume).not.toHaveValue(before);
  await expect(volume).toBeFocused();
});
test("gallery dialog closes with Escape and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/components.html");
  const trigger = page.getByRole("button", { name: /Abrir imagem.*montanhas/ });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Ampliar", exact: true }).click();
  await expect(page.getByRole("status", { name: "Zoom" })).toHaveText("125%");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("narrow view and forced colors preserve controls without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/tests/fixtures/components.html");
  await expect(
    page.getByRole("button", { name: "Reproduzir", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
test("fullscreen menus remain inside the displayed player and allow speed selection", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/components.html");
  await page.getByRole("button", { name: "Tela cheia", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => !!document.fullscreenElement))
    .toBe(true);
  await page.getByRole("button", { name: "Velocidade", exact: true }).click();
  await expect(
    page.getByRole("menuitemcheckbox", { name: "1.5×" }),
  ).toBeVisible();
  await page.getByRole("menuitemcheckbox", { name: "1.5×" }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.playbackRate),
    )
    .toBe(1.5);
  await page.keyboard.press("Escape");
});
