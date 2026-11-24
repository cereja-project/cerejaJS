import { cp, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url),
  target = new URL("apps/docs/public/fixtures/", root);
await mkdir(target, { recursive: true });
for (const name of ["media", "tracks", "streams"])
  await cp(new URL("tests/fixtures/" + name, root), new URL(name, target), {
    recursive: true,
    filter: (p) => !p.endsWith("server.ts"),
  });
