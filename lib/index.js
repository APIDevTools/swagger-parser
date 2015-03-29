'use strict';

module.exports.parse = require('./parse');
module.exports.defaults = require('./defaults');

/** @private */
module.exports.__YAML = require('js-yaml').safeLoad;
