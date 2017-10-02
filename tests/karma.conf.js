// Karma configuration
module.exports = function (config) {
  config.set({
    // ... normal karma configuration
    files: [
      // all files ending in "_test"
      // { pattern: 'test/*_test.js', watched: false },
      // { pattern: 'test/**/*_test.js', watched: false }
      // each file acts as entry point for the webpack configuration
      { pattern: 'src/index.tsx', watched: false }
    ],

    preprocessors: {
      // add webpack as preprocessor
      // 'test/*_test.js': ['webpack'],
      // 'test/**/*_test.js': ['webpack'],
      'src/*.tsx': ['webpack', 'sourcemap'],
      'src/**/*.tsx': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack.config'),

    client: {
      mocha: {
        reporter: 'html', // debug
      },
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },
    browsers: [
      'FirefoxNightly',
    ],
    frameworks: ['mocha', 'chai'],
    plugins: [
      require("karma-mocha"),
      require("karma-chai"),
      require("karma-webpack"),
      require("karma-sourcemap-loader"),
      require("karma-firefox-launcher"),
    ]
  });
};
