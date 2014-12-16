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
   * A map of resolved "$ref" pointers to their values
   */
  this.resolvedPointers = {};
}

