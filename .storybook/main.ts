import type { StorybookConfig } from "@storybook/react-vite";
import wyw from "@wyw-in-js/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tsconfigPaths(), wyw()],
  }),
} satisfies StorybookConfig;
