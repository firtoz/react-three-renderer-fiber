// tell karma to use puppeteer's version of Chrome
process.env.CHROME_BIN = require('puppeteer').executablePath()

// list of all browsers that can run the tests,
// ordered from most to least preferred option
const browserPreferences = [
    'FirefoxNightly',
    'Firefox',
    'Chrome', // will usually stop here (puppeteer)
    'SafariTechPreview',
    'Safari',
    'Edge'
]

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

    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function(availableBrowsers) {
        if (config.browsers.length > 0) return config.browsers;
        // check installed browsers, run tests using the most
        // preferred one defined in browserPreferences array
        for (const browser of browserPreferences) {
          if (availableBrowsers.indexOf(browser) >= 0) {
            console.log(`Testing with ${browser}`)
            return [browser]
          }
        }
      }
    },

    frameworks: ['mocha', 'chai', 'detectBrowsers'],

    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-safaritechpreview-launcher',
      'karma-detect-browsers'
    ]
  });
};
