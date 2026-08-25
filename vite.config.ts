import { existsSync } from "node:fs";
import { join } from "node:path";

import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import manifest from "./manifest.config";

const customConfigPath = join(import.meta.dirname, "nlb.config.js");
const defaultConfigPath = join(import.meta.dirname, "nlb.config.default.js");

export default defineConfig({
  plugins: [tsconfigPaths(), wyw(), react(), crx({ manifest })],
  resolve: {
    alias: {
      "embeded-settings": existsSync(customConfigPath)
        ? customConfigPath
        : defaultConfigPath,
    },
  },
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
