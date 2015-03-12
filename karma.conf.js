// Karma configuration

// PhantomJS and Firefox are available on all OSes
var browsers = ['PhantomJS', 'Firefox'];

// Chrome and Safari are available on Windows and Mac, but not on Travis CI
if (process.env.TRAVIS !== 'true') {
  browsers.push('Chrome');
  browsers.push('Safari');
}

// IE is only available on Windows
if (/^win/.test(process.platform)) {
  browsers.push('IE');
}


module.exports = function(config) {
  'use strict';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      // Swagger-Parser
      'dist/swagger-parser.js',
      { pattern: 'dist/swagger-parser.js.map', included: false },

      // Swagger-Parser Tests
      'tests/test-environment.js',
      'tests/files/text-resolved.js',
      'tests/files/image-resolved.js',
      'tests/files/real-world/file-list.js',
      'tests/files/**/*-resolved.js',
      'tests/files/**/*-dereferenced.js',
      'tests/specs/**/*-spec.js',

      // Serve Swagger files upon request
      { pattern: 'tests/files/**', included: false }
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // amount of time (in ms) before a browser is considered "hung"
    browserNoActivityTimeout: 3000,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
