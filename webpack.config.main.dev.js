const { join } = require("path")

module.exports = {

  output: {
    path: join(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".scss", ".css"]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", options: { presets: ["react"] } }
    ]
  },
  stats: "minimal"
};
