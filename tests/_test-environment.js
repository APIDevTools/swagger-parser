(function() {
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
     * Helpers for accessing/testing the YAML and JSON Swagger files.
     */
    files: {
      /**
       * Pre-parsed (but not dereferenced) Swagger files.
       */
      parsed: {},


      /**
       * Pre-parsed and dereferenced Swagger files.
       */
      dereferenced: {},


      /**
       * Returns the correct path of the given YAML or JSON Swagger file, based on the current environment.
       */
      getPath: function(fileName) {
        if (env.isNode) {
          return path.join(__dirname, 'files', fileName);
        }
        else {
          return env.__dirname + '/files/' + fileName;
        }
      }
    },


    /**
     * Regex patterns to match error messages that are different across environments.
     */
    errorMessages: {
      illegalCharacter: /(Unexpected token|unexpected character|Unexpected identifier|Invalid character|Unable to parse JSON string)/,
      endOfFile: /(Unexpected end of input|unexpected end of data|Unexpected EOF|Syntax error|Unable to parse JSON string)/,
      downloadFailed: /(Unable to download file|ENOTFOUND|not a valid Swagger spec)/
    },


    /**
     * Returns a function that calls the given function with the given parameters.
     * This is useful for `expect(fn).to.throw` tests.
     */
    call: function(fn, params) {
      params = _.rest(arguments);
      return function() {
        fn.apply(null, params);
      };
    }
  };


  if (env.isNode) {
    // Set env properties for Node.js
    env.global = global;
    env.parser = require('../index.js');
    env.__filename = __filename;
    env.__dirname = __dirname;

    // Set globals for use in tests
    global.env = env;
    global.expect = require('chai').expect;
    global.path = require('path');
    global._ = require('lodash');
  }
  else {
    // Set env properties for browsers
    env.global = window;
    env.parser = window.swagger.parser;
    env.__filename = document.querySelector('script[src*="test-environment.js"]').src;
    env.__dirname = env.__filename.substr(0, env.__filename.lastIndexOf('/'));

    // Set globals for use in tests
    window.env = env;
    window.expect = window.chai.expect;
  }

})();
