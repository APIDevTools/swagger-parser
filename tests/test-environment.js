'use strict';

var env = {
  /**
   * Are we running in Node?
   */
  isNode: typeof(require) === 'function',

  /**
   * Are we running in a browser?
   */
  isBrowser: typeof(require) !== 'function',

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
  dereferenced: {},

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
  },

  /**
   * Determines whether the given object is a valid metadata object
   */
  isMetadata: function(metadata) {
    try {
      expect(typeof(metadata)).to.equal('object');
      expect(Object.keys(metadata)).to.have.same.members(['baseDir', 'files', 'urls', '$refs']);
      expect(metadata.baseDir).to.be.a('string').and.not.to.be.empty;
      expect(metadata.$refs).to.be.an('object');
      expect(metadata.files).to.be.an('array');
      expect(metadata.urls).to.be.an('array');
      metadata.files.forEach(function(file) {
        expect(file).to.be.a('string').and.not.to.be.empty;
      });
      metadata.urls.forEach(function(url) {
        expect(url).to.be.an('object').with.property('href').that.is.not.empty;
      });
      return true;
    }
    catch (e) {
      return false;
    }
  }
};

if (env.isNode) {
  // Set env properties for Node.js
  env.global = global;
  env.parser = require('../');
  env.cloneDeep = env.parser.__.cloneDeep;
  env.__filename = __filename;
  env.__dirname = __dirname = __dirname.substr(0, 1).toLowerCase() + __dirname.substr(1); // C:\ => c:\

  // Set globals for use in tests
  global.env = env;
  global.expect = require('chai').expect;
  global.sinon = require('sinon');
  global.path = require('path');
  global.url = require('url');
}
else {
  // Set env properties for browsers
  env.global = window;
  env.parser = window.swagger.parser;
  env.cloneDeep = window.swagger.parser.__.cloneDeep;
  env.__filename = document.querySelector('script[src*="test-environment.js"]').src;
  env.__dirname = env.__filename.substr(0, env.__filename.lastIndexOf('/'));

  // Set globals for use in tests
  window.env = env;
  window.expect = window.chai.expect;
  window.require = function() {};
}
