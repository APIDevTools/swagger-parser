/**
 * This script exposes everything as globals, to allow tests to run in Node and in browsers.
 *
 * Why not use Browserify instead of globals?
 *  - To make sure Swagger Parser works properly when Node and CommonJS are not available
 *  - Some of our devDependencies have separate packages packages for Node vs. Browser (e.g. Mocha, Sinon)
 *  - This reduces redundant boilerplate code in the .spec files
 */
(function() {
  'use strict';

  if (typeof window === 'object') {
    // Expose Browser globals
    window.global = window;
    window.expect = chai.expect;
    window.userAgent = {
      isNode: false,
      isBrowser: true,
      isKarma: !!window.__karma__
    };
  }
  else {
    // Expose Node globals
    global.SwaggerParser = require('../../');
    global.superagent = require('superagent');
    global.expect = require('chai').expect;
    global.path = require('path');

    global.userAgent = {
      isNode: true,
      isBrowser: false,
      isTravisCI: !!process.env.TRAVIS
    };
  }

}());
