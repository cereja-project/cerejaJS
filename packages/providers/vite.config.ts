import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: {
      entry: Object.fromEntries(
        ["index", "native", "hls", "dash", "youtube", "vimeo", "config"].map(
          (name) => [name, "src/" + name + ".ts"],
        ),
      ),
      formats: ["es"],
      fileName: (_format, name) => name + ".js",
    },
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@cereja-ui\//,
        "hls.js",
        "dashjs",
        "@vimeo/player",
      ],
    },
  },
});
