import { existsSync } from "node:fs";
import { join } from "node:path";

import { defineManifest } from "@crxjs/vite-plugin";

import pkg from "./package.json";

const customConfigPath = join(import.meta.dirname, "nlb.config.js");
const defaultConfigPath = join(import.meta.dirname, "nlb.config.default.js");

export default defineManifest(async () => {
  const nlbConfig = (
    await import(
      existsSync(customConfigPath) ? customConfigPath : defaultConfigPath
    )
  ).default;

  return {
    // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
    manifest_version: 3,
    name: nlbConfig.manifest.name,
    description: nlbConfig.manifest.description,
    version: nlbConfig.manifest.version ?? pkg.version,
    icons: {
      "32": "icon-32.png",
      "48": "icon-48.png",
      "128": "icon-128.png",
    },
    action: {
      // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
      default_icon: { "38": "icon-38.png" },
      // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
      default_popup: "src/pages/popup/index.html",
    },
    // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
    content_scripts: [
      {
        matches: ["https://www.notion.so/*", "https://app.notion.com/*"],
        js: ["src/pages/content_script/index.tsx"],
      },
    ],
    background: {
      // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
      service_worker: "src/pages/background/index.ts",
      type: "module",
    },
    permissions: ["tabs", "storage"],
    // biome-ignore lint/style/useNamingConvention: Chrome extension manifest schema requires snake_case field names
    host_permissions: ["https://api.notion.com/*"],
  };
});
