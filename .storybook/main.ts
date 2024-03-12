import { StorybookConfig } from "@storybook/react-webpack5";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react-webpack5",
  staticDirs: ["../public"],
  webpackFinal: (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules ?? []),
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [{ loader: "@wyw-in-js/webpack-loader" }],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      plugins: [...(config.resolve?.plugins ?? []), new TsconfigPathsPlugin()],
    },
  }),
} as StorybookConfig;
