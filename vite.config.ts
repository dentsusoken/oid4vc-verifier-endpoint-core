import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/index.ts",
      name: "oid4vc-verifier-endpoint-core",
      fileName: "index",
    },
  },
});
