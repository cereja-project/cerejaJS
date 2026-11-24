import entries from "./generated-examples.json";
import type { Variant } from "./WidgetPreview";
export interface CatalogEntry {
  id: string;
  name: string;
  group: string;
  description: string;
  props: Array<{ name: string; type: string }>;
  variants: Variant[];
  keyboard: string;
  requirements: string;
  tsx: string;
  jsx: string;
}
export const catalog = entries as CatalogEntry[];
export const groups = [...new Set(catalog.map((entry) => entry.group))];
