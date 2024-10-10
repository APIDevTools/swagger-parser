"use strict";

/**
 * JSDoc rules for JavaScript and TypeScript
 */
module.exports = {
  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-access
   */
  "jsdoc/check-access": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-alignment
   */
  "jsdoc/check-alignment": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-param-names
   */
  "jsdoc/check-param-names": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-property-names
   */
  "jsdoc/check-property-names": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-syntax
   */
  "jsdoc/check-syntax": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-tag-names
   */
  "jsdoc/check-tag-names": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-values
   */
  "jsdoc/check-values": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-empty-tags
   */
  "jsdoc/empty-tags": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-implements-on-classes
   */
  "jsdoc/implements-on-classes": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-description
   */
  "jsdoc/require-description": [
    "warn",
    {
      contexts: [
        "FunctionDeclaration", "ClassDeclaration", "ClassExpression", "ClassProperty",
        "MethodDefinition", "ExportNamedDeclaration", "TSInterfaceDeclaration", "TSPropertySignature",
        "TSMethodSignature", "TSTypeAliasDeclaration", "TSDeclareFunction", "TSEnumDeclaration",
        "TSEmptyBodyFunctionExpression", "TSFunctionType"
      ],
    }
  ],

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-jsdoc
   */
  "jsdoc/require-jsdoc": [
    "warn",
    {
      enableFixer: false
    }
  ],

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-description
   */
  "jsdoc/require-param-description": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-name
   */
  "jsdoc/require-param-name": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-property
   */
  "jsdoc/require-property": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-property-description
   */
  "jsdoc/require-property-description": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-property-name
   */
  "jsdoc/require-property-name": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns-check
   */
  "jsdoc/require-returns-check": "warn",

  /**
   * @see https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns-description
   */
  "jsdoc/require-returns-description": "warn",
};
