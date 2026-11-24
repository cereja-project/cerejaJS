import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { zipSync } from "fflate";
const npmCli = process.env.npm_execpath;
if (!npmCli)
  throw new Error("Execute este script pelo comando npm run correspondente.");
const root = fileURLToPath(new URL("../", import.meta.url));
const out = join(root, "artifacts");
await mkdir(out, { recursive: true });
for (const name of ["core", "providers", "react"])
  execFileSync(
    process.execPath,
    [
      npmCli,
      "pack",
      "--workspace",
      `@cereja-project/ui-${name}`,
      "--pack-destination",
      out,
    ],
    { cwd: root, stdio: "pipe" },
  );
const files = {};
const ignored = new Set([
  "node_modules",
  ".git",
  ".superpowers",
  "test-results",
  "playwright-report",
]);
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name.startsWith(".env")) continue;
    const path = join(dir, entry.name);
    if (path === join(root, "apps", "docs", "public", "fixtures")) continue;
    if (entry.isDirectory()) await visit(path);
    else if (entry.isFile() && !entry.name.endsWith(".zip"))
      files[
        "cereja-ui/" + relative(root, path).replaceAll("\\", "/")
      ] = new Uint8Array(await readFile(path));
  }
}
await visit(root);
const archive = zipSync(files, { level: 6 });
const path = join(out, "cereja-ui.zip");
await writeFile(path, archive);
console.log(
  `${path} — ${Object.keys(files).length} arquivos — ${archive.byteLength} bytes`,
);
