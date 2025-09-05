var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  //Ebable HTML generation
  plugins: [
    new HtmlWebpackPlugin(),
    //new TypedocWebpackPlugin({
    //    out: './docs',
    //    target: 'es6',
    //    theme: 'minimal'
    //}, './src')
  ],
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
}
