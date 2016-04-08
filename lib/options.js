'use strict';

var $RefParserOptions = require('json-schema-ref-parser/lib/options'),
    util              = require('util');

module.exports = ParserOptions;

/**
 * Options that determine how Swagger APIs are parsed, resolved, dereferenced, and validated.
 *
 * @param {object|ParserOptions} [options] - Overridden options
 * @constructor
 * @extends $RefParserOptions
 */
function ParserOptions(options) {
  $RefParserOptions.call(this, ParserOptions.defaults);
  $RefParserOptions.apply(this, arguments);
}

ParserOptions.defaults = {
  validate: {
    schema: {
      order: 1  // NOTE: This cannot be changed. It's just here for future use
    },
    spec: {
      order: 2  // NOTE: This cannot be changed. It's just here for future use
    }
  }
};

util.inherits(ParserOptions, $RefParserOptions);
