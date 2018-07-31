const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: require.resolve("./src/index.tsx"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },

  devServer: {
    publicPath: "/dist/"
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".d.ts"],
    alias: {
      three: path.resolve(__dirname, '../node_modules/three'),
    }
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/, loader: "awesome-typescript-loader", options: {
          configFileName: require.resolve("./tsconfig"),
        }
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENABLE_REACT_ADDON_HOOKS': process.env.ENABLE_REACT_ADDON_HOOKS ? "true" : "false",
        'DISABLE_REACT_ADDON_HOOKS': process.env.DISABLE_REACT_ADDON_HOOKS ? "true" : "false",
      },
      VERSION: JSON.stringify(require("package.json").version)
    })
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
};

if (process.env.NODE_ENV === "production") {
  module.exports.mode = "production";
} else {
  module.exports.mode = "development";
  module.exports.devtool = "cheap-module-source-map-eval";
}
