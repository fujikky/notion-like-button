import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  typescript: {
    // react-docgen-typescript is incompatible with TypeScript 7; prop tables
    // aren't needed for this project.
    reactDocgen: false,
  },
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tsconfigPaths(), wyw()],
  }),
} satisfies StorybookConfig;
