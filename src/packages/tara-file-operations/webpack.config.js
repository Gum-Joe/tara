const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/components/index.tsx",
  mode: "development",
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "lib", "bundle"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js", // string
  },
  target: "node",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".scss", ".css"]
  },
  module: {
    rules: [
     { test: /\.tsx?$/, loader: "ts-loader", exclude: [/node_modules/], options: { transpileOnly: true } },
     { test: /\.ts$/, loader: "ts-loader", exclude: [/node_modules/], options: { transpileOnly: true } },
     {
       test: /\.jsx?$/,
       use: ["source-map-loader"],
       enforce: "pre"
     },
    ]
  },
  stats: "minimal",
  devtool: process.env.NODE_ENV === "production" ? "none" : "source-map",
  plugins: [
    /**
    https://github.com/electron-userland/electron-webpack/issues/101
    new HtmlWebpackPlugin({ // 
      title: "Tara",
      template: "src/html/index.html",
      hash: true
    }),
    */
    new webpack.DefinePlugin({
      "process.env.FORCE_COLOR": JSON.stringify(1),
      "process.env.DEBUG": JSON.stringify(true)
    })
  ]
};
