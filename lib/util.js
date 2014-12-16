'use strict';

var format = require('util').format;
var _ = require('lodash');


module.exports = {
  /**
   * Asynchronously invokes the given callback function with the given parameters.
   * This allows the call stack to unwind, which is necessary because there can be a LOT of
   * recursive calls when dereferencing large Swagger specs.
   * @param {function} callback
   * @param {*}     [err]
   * @param {...*}  [params]
   */
  doCallback: function(callback, err, params) {
    var args = _.rest(arguments);
    process.nextTick(function() {
      callback.apply(null, args);
    });
  },


  /**
   * Creates an Error with a formatted string message.
   * @param   {string}      message
   * @param   {...*}        [params]
   * @returns {Error}
   */
  error: function(message, params) {
    return new Error(format.apply(null, [message].concat(_.rest(arguments))));
  },


  /**
   * Creates a SyntaxError with a formatted string message.
   * @param   {string}      message
   * @param   {...*}        [params]
   * @returns {SyntaxError}
   */
  syntaxError: function(message, params) {
    return new SyntaxError(format.apply(null, [message].concat(_.rest(arguments))));
  }
};
