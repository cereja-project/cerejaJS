import { defineConfig } from "vite";
import { resolve } from "node:path";
import { liveFixturePlugin } from "./tests/fixtures/streams/server";
export default defineConfig({
  publicDir: "apps/docs/public",
  plugins: [liveFixturePlugin()],
  resolve: {
    alias: {
      "@cereja-project/ui-core": resolve("packages/core/src/index.ts"),
      "@cereja-project/ui-react": resolve("packages/react/src/index.ts"),
      "@cereja-project/ui-providers": resolve("packages/providers/src"),
    },
  },
});
