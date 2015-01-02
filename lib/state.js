'use strict';

module.exports = State;

/**
 * The state for the current parsing operation
 * @constructor
 */
function State() {
    /**
     * The path of the main Swagger file that's being parsed
     * @type {string}
     */
    this.swaggerPath = '';

    /**
     * The options for the parsing operation
     * @type {defaults}
     */
    this.options = null;

    /**
     * The Swagger API that is being parsed.
     * @type {SwaggerObject}
     */
    this.swagger = null;

    /**
     * The directory of the Swagger file
     * (used as the base directory for resolving relative file references)
     */
    this.baseDir = null;

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
     * A map of "$ref" pointers and their resolved values
     */
    this.$refs = {};
}


/**
 * The Swagger object (https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#swagger-object-)
 * @typedef {{swagger: string, info: {}, paths: {}}} SwaggerObject
 */
