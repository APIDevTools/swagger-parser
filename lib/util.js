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
   * The HTTP methods that Swagger supports
   * (see https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#pathItemObject)
   */
  swaggerMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'],

  /**
   * Regular Expression that matches Swagger path params.
   */
  swaggerParamRegExp: /\{([^/}]+)}/g,

  format: util.format,
  inherits: util.inherits,
  doCallback: $RefParserUtil.doCallback
};
