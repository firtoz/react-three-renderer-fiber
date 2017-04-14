var path = require('path');

module.exports = {
  entry: './app/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    filename: 'bundle.js',
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ]
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          "presets": [
            "react",
            "env"
          ],
          "plugins": [
            "transform-class-properties"
          ]
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          "presets": [
            "env"
          ],
          "plugins": [
            "transform-class-properties"
          ]
        }
      }
    ]
  }
};
