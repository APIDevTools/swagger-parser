// Karma config
// https://karma-runner.github.io/0.12/config/configuration-file.html
'use strict';

var baseConfig = {
  frameworks: ['mocha'],
  reporters: ['mocha'],
  files: [
    // Third-Party Libraries
    'tests/bower_components/chai/chai.js',
    'tests/bower_components/sinon-js/sinon.js',

    // Swagger Parser
    'dist/swagger-parser.min.js',
    {pattern: 'dist/*.map', included: false, served: true},

    // Test Fixtures
    'tests/fixtures/**/*.js',
    {pattern: 'tests/files/**', included: false, served: true},

    // Tests
    'tests/specs/**/*.spec.js'
  ]
};

module.exports = function(config) {
  var karma = process.env.KARMA ? process.env.KARMA === 'true' : true;
  var coverage = process.env.KARMA_COVERAGE ? process.env.KARMA_COVERAGE === 'true' : true;
  var sauce = process.env.KARMA_SAUCE ? process.env.KARMA_SAUCE === 'true' : true;
  var sauceUsername = process.env.SAUCE_USERNAME;
  var sauceAccessKey = process.env.SAUCE_ACCESS_KEY;

  if (!karma) {
    // Karma is disabled, so abort immediately
    process.exit();
    return;
  }

  if (coverage) {
    configureCodeCoverage(baseConfig);
  }

  if (sauce && sauceUsername && sauceAccessKey) {
    configureSauceLabs(baseConfig);
  }
  else {
    configureLocalBrowsers(baseConfig);
  }

  console.log('Karma Config:\n', JSON.stringify(baseConfig, null, 2));
  config.set(baseConfig);
};

/**
 * Configures the code-coverage reporter
 */
function configureCodeCoverage(config) {
  config.reporters.push('coverage');
  config.files.splice(config.files.indexOf('dist/swagger-parser.min.js'), 1, 'dist/swagger-parser.test.js');
  config.coverageReporter = {
    reporters: [
      {type: 'text-summary'},
      {type: 'lcov'}
    ]
  };
}

/**
 * Configures the browsers for the current platform
 */
function configureLocalBrowsers(config) {
  var isMac     = /^darwin/.test(process.platform),
      isWindows = /^win/.test(process.platform),
      isLinux   = !(isMac || isWindows);

  if (isMac) {
    config.browsers = ['PhantomJS', 'Firefox', 'Chrome', 'Safari'];
  }
  else if (isLinux) {
    config.browsers = ['PhantomJS', 'Firefox'];
  }
  else if (isWindows) {
    config.browsers = ['PhantomJS', 'Firefox', 'Chrome', 'Safari', 'IE9', 'IE10', 'IE'];
    config.customLaunchers = {
      // NOTE: IE 6, 7, 8 are not supported by Chai
      IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      },
      IE10: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE10'
      }
    };
  }
}

/**
 * Configures Sauce Labs emulated browsers/devices.
 * https://github.com/karma-runner/karma-sauce-launcher
 */
function configureSauceLabs(config) {
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
    'IE-9': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '9'
    },
    'IE-10': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '10'
    },
    'IE-11': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'internet explorer',
      version: '11'
    },
    'IE-Edge': {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge'
    },
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
    'Opera-Latest': {
      base: 'SauceLabs',
      platform: 'Windows 7',
      browserName: 'opera'
    },
    'Safari-Latest': {
      base: 'SauceLabs',
      platform: 'OS X 10.10',
      browserName: 'safari'
    },
    'iOS-6': {
      base: 'SauceLabs',
      platform: 'OS X 10.10',
      browserName: 'iphone',
      version: '6'
    },
    'iOS-8': {
      base: 'SauceLabs',
      platform: 'OS X 10.10',
      browserName: 'iphone',
      version: '8'
    },
    'Android-4-4': {
      base: 'SauceLabs',
      platform: 'Linux',
      browserName: 'android',
      version: '4.4'
    },
    'Android-5': {
      base: 'SauceLabs',
      platform: 'Linux',
      browserName: 'android',
      version: '5'
    }
  };

  config.reporters.push('saucelabs');
  config.browsers = Object.keys(config.customLaunchers);
}
