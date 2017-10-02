const path = require('path');

module.exports = {
  // entry: "../src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "eval-inline-source-map",

  devServer: {
    publicPath: "/dist/"
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json", ".d.ts"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/, loader: "awesome-typescript-loader",
        options: {
          "configFileName": require.resolve('./tsconfig.json'),
          "useBabel": true,
          "babelOptions": {
            "plugins": [
              require.resolve('./utils/babel-test-plugin.js')
            ]
          },
          "babelCore": require.resolve("babel-core")
        }
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { enforce: "pre", test: /\.tsx?$/, loader: "source-map-loader" }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    // "react": "React",
    // "react-dom": "ReactDOM"
  },
};
