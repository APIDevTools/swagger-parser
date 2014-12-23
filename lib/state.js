'use strict';

module.exports = State;

/**
 * The state for the current parsing operation
 * @constructor
 */
function State() {
  /**
   * The directory of the Swagger file
   * (used as the base directory for resolving relative file references)
   */
  this.baseDir = null;

  /**
   * The options for the parsing operation
   * @type {defaults}
   */
  this.options = null;

  /**
   * The Swagger object that is being parsed.
   */
  this.swagger = null;

  /**
   * The files that have been read during the parsing operation.
   * @type {string[]}
   */
  this.files = [];

  /**
   * The URLs that have been downloaded during the parsing operation.
   * @type {url.Url[]}
   */
  this.urls = [];

  /**
   * A map of resolved "$ref" pointers and values
   */
  this.resolvedPointers = {};
}

