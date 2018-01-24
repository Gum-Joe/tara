const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".scss", ".css"]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", options: { presets: ["react"] } },
    ]
  },
  stats: "minimal",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Tara",
      template: "src/html/index.html",
      hash: true
    }),
    new webpack.DefinePlugin({
      "process.env.FORCE_COLOR": JSON.stringify(1)
    }),
  ]
};
