import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { liveFixturePlugin } from "../../tests/fixtures/streams/server";
const root = fileURLToPath(new URL("../../", import.meta.url));
export default defineConfig({
  plugins: [liveFixturePlugin({ segmentsBase: "/fixtures/streams/hls" })],
  root: fileURLToPath(new URL("./", import.meta.url)),
  resolve: {
    alias: {
      "@cereja-project/ui-core": root + "packages/core/src/index.ts",
      "@cereja-project/ui-react/styles.css": root + "packages/react/src/styles/all.css",
      "@cereja-project/ui-react": root + "packages/react/src/index.ts",
      "@cereja-project/ui-providers": root + "packages/providers/src/index.ts",
    },
  },
  server: { host: "127.0.0.1", fs: { allow: [root] } },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("index.html", import.meta.url)),
        jsxSnippets: fileURLToPath(
          new URL("src/catalog/snippets/jsx-index.jsx", import.meta.url),
        ),
        jsxExamples: fileURLToPath(
          new URL("src/examples/complete/jsx-index.jsx", import.meta.url),
        ),
      },
    },
  },
});
