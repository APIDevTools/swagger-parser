"use strict";

/**
 * These rules ONLY apply to JavaScript, not TypeScript.
 */
module.exports = {
  /**
   * Enforce one true brace style
   *
   * @see https://eslint.org/docs/rules/brace-style
   */
  "brace-style": [
    "error",
    "stroustrup",
    {
      // allow opening and closing brace to be on the same line
      allowSingleLine: true,
    },
  ],

  /**
   * Enforce spacing after comma (but not before)
   *
   * @see https://eslint.org/docs/rules/comma-spacing
   */
  "comma-spacing": [
    "warn",
    {
      before: false,
      after: true,
    },
  ],

  /**
   * Require default parameters to be the last parameters in the function
   *
   * @see https://eslint.org/docs/rules/default-param-last
   */
  "default-param-last": "error",

  /**
   * Encourages use of dot notation whenever possible
   *
   * @see https://eslint.org/docs/rules/dot-notation
   */
  "dot-notation": "error",

  /**
   * Disallow spaces after the function name in function calls
   *
   * @see https://eslint.org/docs/rules/func-call-spacing
   */
  "func-call-spacing": "error",

  /**
   * Require a space before and after keywords
   *
   * @see https://eslint.org/docs/rules/keyword-spacing
   */
  "keyword-spacing": "error",

  /**
   * Require a blank line between class members
   *
   * @see https://eslint.org/docs/rules/lines-between-class-members
   */
  "lines-between-class-members": [
    "error",
    "always",
    {
      exceptAfterSingleLine: true,
    }
  ],

  /**
   * Disallow use of the Array constructor
   *
   * @see https://eslint.org/docs/rules/no-array-constructor
   */
  "no-array-constructor": "error",

  /**
   * Disallow duplicate name in class members
   *
   * @see https://eslint.org/docs/rules/no-dupe-class-members
   */
  "no-dupe-class-members": "error",

  /**
   * Warn about empty functions
   *
   * @see https://eslint.org/docs/rules/no-empty-function
   */
  "no-empty-function": "warn",

  /**
   * Disallow unnecessary semicolons
   *
   * @see https://eslint.org/docs/rules/no-extra-semi
   */
  "no-extra-semi": "error",

  /**
   * Disallow unnecessary `return await` statements
   *
   * @see https://eslint.org/docs/rules/no-return-await
   */
  "no-return-await": "error",

  /**
   * Disallow usage of expressions in statement position
   *
   * @see https://eslint.org/docs/rules/no-unused-expressions
   */
  "no-unused-expressions": [
    "error",
    {
      allowShortCircuit: true,   // allow short-circuited expressions (e.g. foo && bar())
      allowTernary: true,        // allow ternary expressions (e.g. foo ? bar() : baz())
    },
  ],

  /**
   * Disallow declaration of variables that are not used in the code
   *
   * @see https://eslint.org/docs/rules/no-unused-vars
   */
  "no-unused-vars": [
    "error",
    {
      vars: "all",                // check "all" variables (as opposed to just "local" variables)
      args: "after-used",         // check any arguments that come "after-used" arguments
      ignoreRestSiblings: true,   // ignore siblings of ...rest params
      argsIgnorePattern: "^_",    // Ignore params that begin with an underscore
      varsIgnorePattern: "^_",    // Ignore variables that begin with an underscore
    },
  ],

  /**
   * Don't allow constructors that are empty or only call super()
   *
   * @see https://eslint.org/docs/rules/no-useless-constructor
   */
  "no-useless-constructor": "error",

  /**
   * Require double quotes for all strings
   *
   * @see https://eslint.org/docs/rules/quotes
   */
  quotes: [
    "error",
    "double",
    "avoid-escape",
  ],

  /**
   * Require async functions to contain an `await` keyword
   *
   * @see https://eslint.org/docs/rules/require-await
   */
  "require-await": "error",

  /**
   * Require use of semicolons instead of ASI
   *
   * @see https://eslint.org/docs/rules/semi
   */
  semi: "error",

  /**
   * Require a space between the function name and left paren in function definitions.
   * This makes it easier to search for function calls versus declarations.
   *
   * @see https://eslint.org/docs/rules/
   */
  // This makes it easier to search for function definitions versus function calls.
  "space-before-function-paren": "error",

  /**
   * Require the "use strict" pragma, either at the global level or function level,
   * depending on whether CommonJS is being used or not
   *
   * @see https://eslint.org/docs/rules/strict
   */
  strict: [
    "error",
    "safe",
  ],
};
