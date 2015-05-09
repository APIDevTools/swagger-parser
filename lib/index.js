'use strict';

module.exports.parse = require('./parse');
module.exports.defaults = require('./defaults');

/**
 * Exposing internal functions for testing purposes.
 * NOTE: These will be removed at some point, SO DON'T USE THEM!
 * @private
 */
module.exports.__ = {
  safeLoad: require('js-yaml').safeLoad,
  cloneDeep: require('lodash/lang/cloneDeep')
};
