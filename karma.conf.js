// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
'use strict';

var baseConfig = {
  frameworks: ['mocha'],
  reporters: ['verbose'],

  // We test against 600+ real-world APIs, each of which is a pretty large download.
  // This often causes flaky browser behavior in CI environments, so set very lenient tolerances
  captureTimeout: 60000,
  browserDisconnectTimeout: 30000,
  browserDisconnectTolerance: 5,
  browserNoActivityTimeout: 60000,

  files: [
    // Third-Party Libraries
    'www/bower_components/chai/chai.js',
    'www/bower_components/superagent-dist/superagent.js',

    // Polyfills for older browsers
    'www/polyfills/promise.js',
    'www/polyfills/typedarray.js',

    // Swagger Parser
    'dist/swagger-parser.min.js',
    { pattern: 'dist/*.map', included: false, served: true },

    // Test Fixtures
    'test/fixtures/**/*.js',

    // Tests
    'test/specs/**/*.js',
    { pattern: 'test/specs/**', included: false, served: true }
  ]
};

module.exports = function (config) {
  var ci = process.env.CI ? process.env.CI === 'true' : false;
  var karma = process.env.KARMA ? process.env.KARMA === 'true' : false;
  var debug = process.env.DEBUG ? process.env.DEBUG === 'true' : false;
  var coverage = process.env.KARMA_COVERAGE ? process.env.KARMA_COVERAGE === 'true' : false;
  var sauce = process.env.KARMA_SAUCE ? process.env.KARMA_SAUCE === 'true' : false;
  var sauceUsername = process.env.SAUCE_USERNAME;
  var sauceAccessKey = process.env.SAUCE_ACCESS_KEY;

  if (ci && !karma) {
    // Karma is disabled, so abort immediately
    process.exit();
    return;
  }

  if (debug) {
    configureForDebugging(baseConfig);
  }
  else {
    if (coverage) {
      configureCodeCoverage(baseConfig);
    }

    if (sauce && sauceUsername && sauceAccessKey) {
      configureSauceLabs(baseConfig);
    }
    else {
      configureLocalBrowsers(baseConfig);
    }
  }

  console.log('Karma Config:\n', JSON.stringify(baseConfig, null, 2));
  config.set(baseConfig);
};

/**
 * Configures Karma to only run Chrome, and with unminified source code.
 * This is intended for debugging purposes only.
 */
function configureForDebugging (config) {
  config.files.splice(config.files.indexOf('dist/swagger-parser.min.js'), 1, 'dist/swagger-parser.js');
  config.browsers = ['Chrome'];
}

/**
 * Configures the code-coverage reporter
 */
function configureCodeCoverage (config) {
  config.reporters.push('coverage');
  config.files.splice(config.files.indexOf('dist/swagger-parser.min.js'), 1, 'dist/swagger-parser.test.js');
  config.coverageReporter = {
    reporters: [
      { type: 'text-summary' },
      { type: 'lcov' }
    ]
  };
}

/**
 * Configures the browsers for the current platform
 */
function configureLocalBrowsers (config) {
  var isMac = /^darwin/.test(process.platform),
      isWindows = /^win/.test(process.platform),
      isLinux = !(isMac || isWindows),
      isCI = process.env.CI;

  if (isCI) {
    config.browsers = ['Firefox', 'ChromeHeadless'];
  }
  else if (isMac) {
    config.browsers = ['Firefox', 'Chrome', 'Safari'];
  }
  else if (isLinux) {
    config.browsers = ['Firefox', 'Chrome'];
  }
  else if (isWindows) {
    config.browsers = ['Firefox', 'Chrome', 'Edge', 'IE'];
  }
}

/**
 * Configures Sauce Labs emulated browsers/devices.
 * https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs (config) {
  var project = require('./package.json');
  var testName = project.name + ' v' + project.version;
  var build = testName + ' Build #' + process.env.TRAVIS_JOB_NUMBER + ' @ ' + new Date();

  config.sauceLabs = {
    build: build,
    testName: testName,
    tags: [project.name],
    recordVideo: true,
    recordScreenshots: true
  };

  config.customLaunchers = {
    'Chrome-Latest': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'chrome'
    },
    'Firefox-Latest': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'firefox'
    },
    'Safari-Latest': {
      base: 'SauceLabs',
      platform: 'OS X 10.10',
      browserName: 'safari'
    },
    'IE-11': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer'
    },
    'IE-Edge': {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge'
    }
  };

  // Exclude these tests when running on SauceLabs.
  // For some reason, these tests seem to make SauceLabs unstable,
  // and it frequently loses connection to the CI server, which causes the build to fail
  config.exclude = (config.exclude || []).concat([
    'test/specs/invalid/*',
    'test/specs/unknown/*',
    'test/specs/validate-schema/*',
    'test/specs/real-world/*'
  ]);

  config.reporters.push('saucelabs');
  config.browsers = Object.keys(config.customLaunchers);
}
