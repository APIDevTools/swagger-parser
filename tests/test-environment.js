(function() {
  'use strict';

  var isNode = typeof(require) === 'function';
  var isBrowser = !isNode;
  var self = isBrowser ? window : global;

  if (isNode) {
    // The unit tests are running in Node, so export all the necessary modules as globals
    self.swagger = global.swagger || {};
    self.swagger.parser = require('../index.js');
    self.expect = require('chai').expect;
    self.path = require('path');
  }

  if (isBrowser) {
    // Set the __filename and __dirname variables, for consistency with Node.js
    self.__filename = document.querySelector('script[src*="test-environment.js"]').src;
    self.__dirname = __filename.substr(0, __filename.lastIndexOf('/'));
  }


  /**
   * Global helper functions for unit tests
   */
  self.env = {
    /**
     * Returns the path of the given Swagger spec file.
     */
    filePath: function(fileName) {
      if (isNode) {
        return path.join(__dirname, 'files', fileName);
      }
      else {
        return __dirname + '/files/' + fileName;
      }
    },

    /**
     * A stub function that can be used whenever a given callback should NOT be called.
     * This function will call the `done` callback for the test, and output detailed results of the unexpected call.
     */
    shouldNotBeCalled: function(done) {
      return function(result) {
        if (!result) {
          done('Done was called unexpectedly with value: ' + result);
        }
        else if (result instanceof Error || result instanceof window.DOMException) {
          done(result);
        }
        else if (typeof(result) === 'object') {
          var typeName = result.constructor ? result.constructor.name : undefined;
          done(typeName + ': \n ' + JSON.stringify(result, null, 2));
        }
        else {
          done(JSON.stringify(result, null, 2));
        }
      };
    },


    /**
     * A general-purpose error handler.  In a synchronous test, it throws an exception.
     * In an asynchronous test, it calls the `done` callback with an error message.
     */
    errorHandler: function(done) {
      function serializeError(error) {
        if (error) {
          // Serialize the error object as JSON so we can see the error details
          return error.toString() + '\n' + JSON.stringify(error, null, 2);
        }
        else {
          return 'An error was expected, but the test completed without throwing any errors';
        }
      }

      if (angular.isFunction(done)) {
        // This is an asynchronous test, so return an error-handler callback function
        return function(error) {
          done(serializeError(error));
        };
      }
      else {
        // This is a synchronous test, so `done` is the error
        if (angular.isString(done)) {
          throw new Error(done);
        }
        else if (done && done instanceof Error) {
          throw done;
        }
        else {
          throw serializeError(done);
        }
      }
    }
  };

})();
