module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".scss", ".css"]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", options: { presets: ["react"] } }
    ]
  },
  stats: "minimal",
  devtool: "source-map"
};
