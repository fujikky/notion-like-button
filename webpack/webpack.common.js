const path = require("path");

// eslint-disable-next-line import/order
const CopyPlugin = require("copy-webpack-plugin");

const pagesDir = path.join(__dirname, "..", "src", "pages");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

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
            loader: "@linaria/webpack-loader",
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
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name]-styles.css" }),
    new CopyPlugin({
      patterns: [{ from: ".", to: "../dist", context: "public" }],
    }),
  ],
};
