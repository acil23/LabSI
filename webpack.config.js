const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),  // ⬅️ pakai build
    filename: "bundle.[contenthash].js",
    publicPath: "/", 
    clean: true
  },
  devtool: isProd ? false : "source-map",
  devServer: {
    static: { directory: path.resolve(__dirname, "build") },
    historyApiFallback: true,
    port: 5173,
    open: true,
    proxy: [
      { context: ["/api"], target: "http://localhost:4000", changeOrigin: true, secure: false } // ⬅️ sesuaikan port backend lokalmu
    ],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: "babel-loader", options: {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: ["@babel/plugin-transform-runtime"]
      }}},
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      { test: /\.(png|jpe?g|gif|svg)$/i, type: "asset/resource" },
      { test: /\.(woff2?|ttf|eot)$/i, type: "asset/resource" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      inject: "body",          // ⬅️ ini kuncinya
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/data", to: "data", noErrorOnMissing: true },
        { from: "public/assets", to: "assets", noErrorOnMissing: true },
        // { from: "public/favicon.ico", to: "favicon.ico", noErrorOnMissing: true }, // kalau ada
      ],
    }),
    new Dotenv({ systemvars: true }),
  ],
  resolve: { extensions: [".js", ".jsx"] },
};
