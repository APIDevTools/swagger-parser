'use strict';

var env = {
  /**
   * Are we running in Node?
   */
  isNode: isNode(),

  /**
   * Are we running in a browser?
   */
  isBrowser: isBrowser(),

  /**
   * Are we running on gh-pages?
   * If so, then we skip certain tests that don't play nice with GitHub's server.
   */
  isGitHub: isGitHub(),

  /**
   * Certain environments (Travis CI and Internet Explorer) are known to be really damn slow.
   * So we need to increase the test timeout thresholds for them.
   */
  timeoutMultiplier: getTimeoutMultiplier(),

  /**
   * The global object (i.e. window or global)
   */
  global: null,

  /**
   * The Swagger-Parser
   * @type {parser}
   */
  parser: null,

  /**
   * A no-op function
   */
  noop: function() {},

  /**
   * Deep-clones an object or array
   */
  cloneDeep: function(obj) {
    var clone = obj;
    if (obj && typeof(obj) === 'object') {
      clone = obj instanceof Array ? [] : {};
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        clone[keys[i]] = env.cloneDeep(obj[keys[i]]);
      }
    }
    return clone;
  },

  /**
   * Returns a function that calls the given function with the given parameters.
   * This is useful for `expect(fn).to.throw` tests.
   */
  call: function(fn, params) {
    params = Array.prototype.slice.call(arguments, 1);
    return function() {
      fn.apply(null, params);
    };
  },

  /**
   * Resolved (but not dereferenced) API objects.
   */
  resolved: {},

  /**
   * Resolved and dereferenced API objects.
   */
  dereferenced: {
    external: {}
  },

  /**
   * The list of real-world Swagger API files (see /tests/files/real-world)
   */
  realWorldFiles: [],

  /**
   * Returns the relative path of the given test file, based on the current environment.
   */
  getPath: function(fileName) {
    var encodedFileName = encodeURIComponent(fileName).split('%2F').join('/');

    if (env.isNode) {
      return path.join('tests', 'files', fileName);
    }
    else if (window.location.href.indexOf(env.__dirname) === 0) {
      // We're running in the "/tests" directory
      return 'files/' + encodedFileName;
    }
    else {
      // We're running from a different path, so use the absolute path, but remove the hostname
      return env.__dirname.replace(/^https?:\/\/[^\/]+(\/.*)/, '$1/files/' + encodedFileName);
    }
  },

  /**
   * Returns the absolute path of the given test file, based on the current environment.
   */
  getAbsolutePath: function(fileName) {
    if (env.isNode) {
      return path.join(__dirname, 'files', fileName || '/');
    }
    else {
      return env.__dirname + '/files/' + fileName;
    }
  }
};

if (env.isNode) {
  // Set env properties for Node.js
  env.global = global;
  env.__filename = __filename;
  env.__dirname = __dirname = __dirname.substr(0, 1).toLowerCase() + __dirname.substr(1); // C:\ => c:\

  // Set globals for use in tests
  global.env = env;
  global.SwaggerParser = require('../');
  global.expect = require('chai').expect;
  global.sinon = require('sinon');
  global.path = require('path');
}
else {
  // Set env properties for browsers
  env.global = window;
  env.__filename = document.querySelector('script[src*="test-environment.js"]').src;
  env.__dirname = env.__filename.substr(0, env.__filename.lastIndexOf('/'));

  // Set globals for use in tests
  window.env = env;
  window.expect = window.chai.expect;
  window.require = function() {};
}

// Set timeout thresholds
beforeEach(function() {
  this.currentTest.timeout(2000 * env.timeoutMultiplier);
  this.currentTest.slow(1000 * env.timeoutMultiplier);
});

/**
 * Are we running in Node (versus a web browser)?
 * @returns {boolean}
 */
function isNode() {
  return typeof(require) === 'function';
}

/**
 * Just the opposite.  :)
 * @returns {boolean}
 */
function isBrowser() {
  return !isNode();
}

/**
 * If we're not running on localhost, then assume we're running on GitHub Pages.
 * @returns {boolean}
 */
function isGitHub() {
  return isBrowser() &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';
}

/**
 * Certain environments (Travis CI and Internet Explorer) are much slower than others,
 * so we increase the normal test timeout for them.
 * @returns {number}
 */
function getTimeoutMultiplier() {
  if (isNode() && process.env.TRAVIS === 'true') {
    // Travis CI
    return 3;
  }
  else if (isBrowser() &&
    (window.navigator.userAgent.indexOf('MSIE') >= 0 || window.navigator.userAgent.indexOf('Trident') >= 0)) {
    // Internet Explorer
    // TODO: We HAVE to find a way to improve performance on IE!!!
    return 10;
  }
  else {
    return 1;
  }
}
