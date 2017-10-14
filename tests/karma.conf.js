module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'src/index.tsx', watched: false }
    ],

    preprocessors: {
      'src/index.tsx': ['webpack', 'sourcemap'],
    },

    webpack: require('./webpack.config').withKarmaConfig(config),

    client: {
      mocha: {
        reporter: 'html', // debug
        require: require.resolve('source-map-support/register'),
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
