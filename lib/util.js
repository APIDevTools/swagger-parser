"use strict";

const util = require("util");

exports.format = util.format;
exports.inherits = util.inherits;

/**
 * Regular Expression that matches Swagger path params.
 */
exports.swaggerParamRegExp = /\{([^/}]+)}/g;
