/**
 * The default parsing options.
 * @name defaults
 * @type {{parseYaml: boolean, resolve$Refs: boolean, resolveExternal$Refs: boolean, validateSchema: boolean}}
 */
module.exports = {
    /**
     * Determines whether the parser will allow Swagger specs in YAML format.
     * If set to `false`, then only JSON will be allowed.
     * @type {boolean}
     */
    parseYaml: true,

    /**
     * Determines whether `$ref` pointers will be resolved.
     * @type {boolean}
     */
    resolve$Refs: true,

    /**
     * Determines whether `$ref` pointers will be resolved if they point to external files or URLs.
     * @type {boolean}
     */
    resolveExternal$Refs: true,

    /**
     * Determines whether `$ref` pointers in the Swagger API object will be replaced with their resolved objects.
     * @type {boolean}
     */
    dereference$Refs: true,

    /**
     * Determines whether the API will be validated against the Swagger schema.
     * @type {boolean}
     */
    validateSchema: true,

    /**
     * Determines whether to perform strict validation, which enforces parts of the Swagger Spec
     * that aren't enforced by the JSON schema.
     * @type {boolean}
     */
    strictValidation: true
};
