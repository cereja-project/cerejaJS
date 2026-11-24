import { readFile, writeFile, mkdir } from "node:fs/promises";
const root = new URL("../packages/react/", import.meta.url);
await mkdir(new URL("dist/", root), { recursive: true });
const tokens = await readFile(new URL("src/styles/tokens.css", root), "utf8"),
  components = await readFile(
    new URL("src/styles/components.css", root),
    "utf8",
  );
await writeFile(new URL("dist/styles.css", root), tokens + "\n" + components);
await writeFile(new URL("dist/tokens.css", root), tokens);
await writeFile(new URL("dist/components.css", root), components);
