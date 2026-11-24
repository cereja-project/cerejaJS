import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import axe from "axe-core";
import { WidgetPreview } from "../../apps/docs/src/catalog/WidgetPreview";
test.each([
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "RadioGroup",
  "Switch",
  "Tabs",
  "Accordion",
  "Breadcrumbs",
  "Pagination",
  "Alert",
  "Progress",
  "Skeleton",
  "EmptyState",
  "MediaGrid",
  "ImageComparison",
  "FilePicker",
])("%s preview has no detectable semantic axe violations", async (name) => {
  const { container } = render(
    <main>
      <h1>Catálogo</h1>
      <h2>Prévia</h2>
      <WidgetPreview name={name} />
    </main>,
  );
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});
