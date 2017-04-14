const path = require('path');

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
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          "presets": [
            "react",
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
