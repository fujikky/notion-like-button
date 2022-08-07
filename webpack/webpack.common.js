const fs = require("fs");
const path = require("path");

// eslint-disable-next-line import/order
const CopyPlugin = require("copy-webpack-plugin");

const pagesDir = path.join(__dirname, "..", "src", "pages");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { DefinePlugin } = require("webpack");

const customConfigPath = path.join(__dirname, "..", "nlb.config.js");
const defaultConfigPath = path.join(__dirname, "nlb.config.default.js");
const configPath = fs.existsSync(customConfigPath)
  ? customConfigPath
  : defaultConfigPath;

module.exports = {
  entry: {
    popup: path.join(pagesDir, "popup", "index.tsx"),
    background: path.join(pagesDir, "background", "index.ts"),
    content_script: path.join(pagesDir, "content_script", "index.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: (chunk) => chunk.name !== "background",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "@linaria/webpack5-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "embeded-settings": configPath,
    },
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new DefinePlugin({
      "process.env.npm_package_version": JSON.stringify(
        process.env.npm_package_version
      ),
    }),
    new MiniCssExtractPlugin({ filename: "[name]-styles.css" }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/manifest.json",
          to: "../dist/manifest.json",
          transform: (buffer) => {
            try {
              const config = require(configPath);
              const manifest = JSON.parse(buffer.toString());

              if (!config.manifest) return buffer;

              const newManifest = { ...manifest, ...config.manifest };

              return JSON.stringify(newManifest, null, 2);
            } catch {
              return buffer;
            }
          },
        },
        {
          from: "./public",
          to: "../dist",
          globOptions: {
            ignore: ["**/manifest.json"],
          },
        },
      ],
    }),
  ],
};
