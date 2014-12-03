(function() {
  'use strict';

  var isNode = typeof(require) === 'function';
  var isBrowser = !isNode;

  // Expose the global object as "env"
  var self = isBrowser ? window : global;
  self.env = self;

  env.isNode = isNode;
  env.isBrowser = isBrowser;

  if (isNode) {
    // The unit tests are running in Node, so export all the necessary modules as globals
    env.parser = require('../index.js');
    env.expect = require('chai').expect;
    env.path = require('path');
    env._ = require('lodash');
  }

  if (isBrowser) {
    env.parser = window.swagger.parser;

    // Set the __filename and __dirname variables, for consistency with Node.js
    env.__filename = document.querySelector('script[src*="test-environment.js"]').src;
    env.__dirname = __filename.substr(0, __filename.lastIndexOf('/'));
  }


  /**
   * Returns the path of the given Swagger spec file.
   */
  env.filePath = function(fileName) {
    if (isNode) {
      return path.join(__dirname, 'files', fileName);
    }
    else {
      return __dirname + '/files/' + fileName;
    }
  };


  /**
   * Returns a function that calls the given function with the given parameters.
   * This is useful for `expect(fn).to.throw` tests.
   */
  env.call = function(fn, params) {
    params = _.rest(arguments);
    return function() {
      fn.apply(null, params);
    };
  };

})();
