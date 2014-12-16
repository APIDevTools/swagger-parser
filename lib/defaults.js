/**
 * The default parsing options.
 * @name defaults
 * @type {{parseYaml: boolean, dereferencePointers: boolean, dereferenceExternalPointers: boolean, validateSpec: boolean}}
 */
module.exports = {
  /**
   * Determines whether the parser will allow Swagger specs in YAML format.
   * If set to `false`, then only JSON will be allowed.  Defaults to `true`.
   * @type {boolean}
   */
  parseYaml: true,

  /**
   * Determines whether `$ref` pointers will be dereferenced.
   * If set to `false`, then the resulting SwaggerObject will contain ReferenceObjects instead of the objects they reference.
   * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
   * Defaults to `true`.
   * @type {boolean}
   */
  dereferencePointers: true,

  /**
   * Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.json").
   * If set to `false`, then the resulting SwaggerObject will contain ReferenceObjects instead of the objects they reference.
   * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
   * Defaults to `true`.
   * @type {boolean}
   */
  dereferenceExternalPointers: true,

  /**
   * Determines whether the Swagger spec will be validated against the Swagger schema.
   * If set to `false`, then the resulting SwaggerObject may be missing properties, have properties of the wrong data type, etc.
   * Defaults to `true`.
   * @type {boolean}
   */
  validateSpec: true
};
