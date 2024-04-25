const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Questa configurazione dice a Webpack di
// utilizzare main.js come entry point e di
// generare un file bundle.js nella directory dist

module.exports = {
  mode: "development", //  modalità su "sviluppo"
  entry: "./src/js/main.js",
  output: {
    path: require("path").resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    static: "./dist",
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
};
