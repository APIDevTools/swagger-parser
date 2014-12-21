'use strict';

module.exports = State;

/**
 * The state for the current parsing operation
 * @constructor
 */
function State() {
  /**
   * The directory where the Swagger file is located
   * (used for resolving relative file references)
   */
  this.swaggerSourceDir = null;

  /**
   * The options for the parsing operation
   * @type {defaults}
   */
  this.options = null;

  /**
   * The entire SwaggerObject
   * (used for resolving schema references)
   */
  this.swaggerObject = null;

  /**
   * The full path and filename of files that have been read during the parsing operation.
   * @type {string[]}
   */
  this.files = [];

  /**
   * The parsed URLs that have been downloaded during the parsing operation.
   * @type {url.Url[]}
   */
  this.urls = [];

  /**
   * A map of resolved "$ref" pointers to their values
   */
  this.resolvedPointers = {};
}

