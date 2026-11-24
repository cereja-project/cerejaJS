import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
export default defineConfig({
  resolve: {
    alias: {
      "@cereja-project/ui-react/styles.css": resolve(
        "packages/react/src/styles/all.css",
      ),
      "@cereja-project/ui-core": resolve("packages/core/src/index.ts"),
      "@cereja-project/ui-react": resolve("packages/react/src/index.ts"),
      "@cereja-project/ui-providers": resolve(
        "packages/providers/src/index.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/consumer/fixtures/**"],
    restoreMocks: true,
  },
});
