const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
  mode: 'development',
  entry: ['./assets/main.css', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Music Player',
      meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      template: 'assets/main.html',
      inject: 'body',
      filename: 'index.html'
    })//,
   // new HtmlWebpackIncludeAssetsPlugin({ assets: ['./assets/main.css'], append: true, hash: true, resolvePaths:true })
  ]
};

