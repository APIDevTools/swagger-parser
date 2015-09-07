'use strict';

var debug          = require('debug'),
    util           = require('util'),
    $RefParserUtil = require('json-schema-ref-parser/lib/util');

module.exports = {
  /**
   * Writes messages to stdout.
   * Log messages are suppressed by default, but can be enabled by setting the DEBUG variable.
   * @type {function}
   */
  debug: debug('swagger:parser'),

  /**
   * Regular Expression that matches Swagger path params.
   */
  swaggerParamRegExp: /\{([^/}]+)}/g,

  format: util.format,
  inherits: util.inherits,
  doCallback: $RefParserUtil.doCallback
};
