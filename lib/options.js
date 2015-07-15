'use strict';

var $RefParserOptions = require('json-schema-ref-parser/lib/options'),
    util              = require('util');

module.exports = Options;

/**
 * @param {Options} options
 * @constructor
 * @extends $RefParserOptions
 */
function Options(options) {
  this.validate = {
    schema: true,
    spec: true
  };

  $RefParserOptions.apply(this, arguments);
}

util.inherits(Options, $RefParserOptions);
