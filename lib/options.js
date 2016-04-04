'use strict';

var $RefParserOptions = require('json-schema-ref-parser/lib/options'),
    util              = require('util');

module.exports = ParserOptions;

/**
 * Options that determine how Swagger APIs are parsed, dereferenced, cached, and validated.
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
    schema: true,
    spec: true
  }
};

util.inherits(ParserOptions, $RefParserOptions);
