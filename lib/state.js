(function() {
  'use strict';

  /**
   * The state for the current parsing operation
   * @type {{swaggerSourceDir: null, options: null, swaggerObject: null, resolvedPointers: {}}}
   */
  var state = module.exports = {
    /**
     * The directory where the Swagger file is located
     * (used for resolving relative file references)
     */
    swaggerSourceDir: null,

    /**
     * The options for the parsing operation
     * @type {defaults}
     */
    options: null,

    /**
     * The entire SwaggerObject
     * (used for resolving schema references)
     */
    swaggerObject: null,

    /**
     * A map of resolved "$ref" pointers to their values
     */
    resolvedPointers: {},

    /**
     * Resets the parse state to default values.
     */
    reset: function() {
      state.swaggerSourceDir = null;
      state.options = null;
      state.swaggerObject = null;
      state.resolvedPointers = {};
    }
  };

})();
