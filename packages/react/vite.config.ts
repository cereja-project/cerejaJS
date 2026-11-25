import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    rollupOptions: {
      output: { banner: '"use client";' },
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@cereja-ui\//,
        /^@radix-ui\//,
        "hls.js",
        "dashjs",
        "@vimeo/player",
      ],
    },
  },
});
