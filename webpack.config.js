const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
    publicPath: "/", // untuk react-router
  },
  devtool: "source-map",
  devServer: {
    static: { directory: path.resolve(__dirname, "dist") },
    historyApiFallback: true, // penting untuk SPA
    port: 5173,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      // Webpack 5 asset modules (untuk img/font)
      { test: /\.(png|jpg|jpeg|gif|svg)$/i, type: "asset/resource" },
      { test: /\.(woff2?|ttf|eot)$/i, type: "asset/resource" },
    ],
  },
  plugins: [
  new HtmlWebpackPlugin({ template: 'public/index.html' }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public/data', to: 'data', noErrorOnMissing: true },
      { from: 'public/assets', to: 'assets', noErrorOnMissing: true },
    ],
  }),
  new Dotenv({ systemvars: true }), // <-- ini yang inject .env
],
  resolve: { extensions: [".js", ".jsx"] },
};
