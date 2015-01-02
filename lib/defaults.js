/**
 * The default parsing options.
 * @name defaults
 * @type {{parseYaml: boolean, resolve$Refs: boolean, resolveExternal$Refs: boolean, validateSchema: boolean}}
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
     * If set to `false`, then the resulting Swagger object will contain ReferenceObjects instead of the objects they reference.
     * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
     * Defaults to `true`.
     * @type {boolean}
     */
    resolve$Refs: true,

    /**
     * Determines whether `$ref` pointers will be dereferenced if they point to external files (e.g. "http://company.com/my/schema.json").
     * If set to `false`, then the resulting Swagger object will contain ReferenceObjects instead of the objects they reference.
     * (see https://github.com/wordnik/swagger-spec/blob/master/versions/2.0.md#reference-object-)
     * Defaults to `true`.
     * @type {boolean}
     */
    resolveExternal$Refs: true,

    /**
     * Determines whether the API will be validated against the Swagger schema.
     * If set to `false`, then the resulting Swagger object may be missing properties, have properties of the wrong data type, etc.
     * Defaults to `true`.
     * @type {boolean}
     */
    validateSchema: true
};
