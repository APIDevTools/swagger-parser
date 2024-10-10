"use strict";

/**
 * These rules apply to both JavaScript and TypeScript
 */
module.exports = {
  /**
   * Require corresponding getters for any setters
   *
   * @see https://eslint.org/docs/rules/accessor-pairs
   */
  "accessor-pairs": "error",

  /**
   * Disallow space inside array square brackets
   *
   * @see https://eslint.org/docs/rules/array-bracket-spacing
   */
  "array-bracket-spacing": "error",

  /**
   * Require space before/after arrow function's arrow
   *
   * @see https://eslint.org/docs/rules/arrow-spacing
   */
  "arrow-spacing": "error",

  /**
   * Treat var statements as if they were block scoped
   *
   * @see https://eslint.org/docs/rules/block-scoped-var
   */
  "block-scoped-var": "error",

  /**
   * Require spaces inside of single-line blocks
   *
   * @see https://eslint.org/docs/rules/block-spacing
   */
  "block-spacing": "error",

  /**
   * Require camel case names
   *
   * @see https://eslint.org/docs/rules/camelcase
   */
  camelcase: "error",

  /**
   * Require commas to be placed at the ends of lines
   *
   * @see https://eslint.org/docs/rules/comma-style
   */
  "comma-style": "error",

  /**
   * Disallow space inside computed property square brackets
   *
   * @see https://eslint.org/docs/rules/computed-property-spacing
   */
  "computed-property-spacing": "error",

  /**
   * Verify calls of super() in constructors
   *
   * @see https://eslint.org/docs/rules/constructor-super
   */
  "constructor-super": "error",

  /**
   * Specify curly brace conventions for all control statements
   *
   * @see https://eslint.org/docs/rules/curly
   */
  curly: [
    "error",
    "multi-line",
    "consistent"
  ],

  /**
   * Specify the placement of dots in multi-line statements
   *
   * @see https://eslint.org/docs/rules/dot-location
   */
  "dot-location": [
    "error",
    "property",
  ],

  /**
   * Enforce newline at the end of file, with no multiple empty lines
   *
   * @see https://eslint.org/docs/rules/eol-last
   */
  "eol-last": "error",

  /**
   * Require the use of === and !==
   *
   * @see https://eslint.org/docs/rules/eqeqeq
   */
  eqeqeq: "error",

  /**
   * Enforce use of function declarations
   *
   * @see https://eslint.org/docs/rules/func-style
   */
  "func-style": [
    "error",
    "declaration",
    {
      allowArrowFunctions: true,
    }
  ],

  /**
   * Make sure for-in loops have an if statement
   *
   * @see https://eslint.org/docs/rules/guard-for-in
   */
  "guard-for-in": "error",

  /**
   * Specify 2-space indentation
   *
   * @see https://eslint.org/docs/rules/indent
   */
  indent: [
    "error",
    2,                        // 2 spaces
    {
      SwitchCase: 1,          // indent multipler for "switch" "case" statements
      VariableDeclarator: {
        var: 2,               // indent multiplier for multi-line "var" statements
        let: 2,               // indent multiplier for multi-line "let" statements
        const: 3,             // indent multiplier for multi-line "const" statements
      },
    },
  ],

  /**
   * Require double for JSX attributes
   *
   * @see https://eslint.org/docs/rules/jsx-quotes
   */
  "jsx-quotes": [
    "error",
    "prefer-double",
  ],

  /**
   * Enforces spacing between keys and values in object literal properties
   *
   * @see https://eslint.org/docs/rules/key-spacing
   */
  "key-spacing": [
    "error",
    {
      beforeColon: false,
      afterColon: true,
    },
  ],

  /**
   * Require a capital letter for constructors
   *
   * @see https://eslint.org/docs/rules/new-cap
   */
  "new-cap": "error",

  /**
   * Disallow the omission of parentheses when invoking a constructor with no arguments
   *
   * @see https://eslint.org/docs/rules/new-parens
   */
  "new-parens": "error",

  /**
   * Disallow the use of alert, confirm, and prompt
   *
   * @see https://eslint.org/docs/rules/no-alert
   */
  "no-alert": "warn",

  /**
   * Disallow use of bitwise operators
   *
   * @see https://eslint.org/docs/rules/no-bitwise
   */
  "no-bitwise": "error",

  /**
   * Disallow use of arguments.caller or arguments.callee
   *
   * @see https://eslint.org/docs/rules/no-caller
   */
  "no-caller": "error",

  /**
   * Disallow modifying variables of class declarations
   *
   * @see https://eslint.org/docs/rules/no-class-assign
   */
  "no-class-assign": "error",

  /**
   * Disallow assignment in conditional expressions
   *
   * @see https://eslint.org/docs/rules/no-cond-assign
   */
  "no-cond-assign": "error",

  /**
   * Disallow modifying variables that are declared using const
   *
   * @see https://eslint.org/docs/rules/no-const-assign
   */
  "no-const-assign": "error",

  /**
   * Disallow use of constant expressions in conditions
   *
   * @see https://eslint.org/docs/rules/no-constant-condition
   */
  "no-constant-condition": [
    "error",
    {
      checkLoops: false,    // allow "while (true)"
    }
  ],

  /**
   * Disallow control characters in regular expressions
   *
   * @see https://eslint.org/docs/rules/no-control-regex
   */
  "no-control-regex": "error",

  /**
   * Disallow use of debugger
   *
   * @see https://eslint.org/docs/rules/no-debugger
   */
  "no-debugger": "error",

  /**
   * Disallow deletion of variables
   *
   * @see https://eslint.org/docs/rules/no-delete-var
   */
  "no-delete-var": "error",

  /**
   * Disallow division operators explicitly at beginning of regular expression
   *
   * @see https://eslint.org/docs/rules/no-div-regex
   */
  "no-div-regex": "error",

  /**
   * Disallow duplicate argument names in functions
   *
   * @see https://eslint.org/docs/rules/no-dupe-args
   */
  "no-dupe-args": "error",

  /**
   * Disallow duplicate keys when creating object literals
   *
   * @see https://eslint.org/docs/rules/no-dupe-keys
   */
  "no-dupe-keys": "error",

  /**
   * Disallow duplicate case labels
   *
   * @see https://eslint.org/docs/rules/no-duplicate-case
   */
  "no-duplicate-case": "error",

  /**
   * Disallow empty statements
   *
   * @see https://eslint.org/docs/rules/no-empty
   */
  "no-empty": "error",

  /**
   * Disallow the use of empty character classes in regular expressions
   *
   * @see https://eslint.org/docs/rules/no-empty-character-class
   */
  "no-empty-character-class": "error",

  /**
   * Disallow comparisons to null without a type-checking operator
   *
   * @see https://eslint.org/docs/rules/no-eq-null
   */
  "no-eq-null": "error",

  /**
   * Disallow use of eval()
   *
   * @see https://eslint.org/docs/rules/no-eval
   */
  "no-eval": "error",

  /**
   * Disallow adding to native types
   *
   * @see https://eslint.org/docs/rules/no-extend-native
   */
  "no-extend-native": "error",

  /**
   * Disallow unnecessary function binding
   *
   * @see https://eslint.org/docs/rules/no-extra-bind
   */
  "no-extra-bind": "error",

  /**
   * Disallow double-negation boolean casts in a boolean context
   *
   * @see https://eslint.org/docs/rules/no-extra-boolean-cast
   */
  "no-extra-boolean-cast": "error",

  /**
   * Disallow fallthrough of case statements
   *
   * @see https://eslint.org/docs/rules/no-fallthrough
   */
  "no-fallthrough": "error",

  /**
   * Disallow the use of leading or trailing decimal points in numeric literals
   *
   * @see https://eslint.org/docs/rules/no-floating-decimal
   */
  "no-floating-decimal": "error",

  /**
   * Disallow overwriting functions written as function declarations
   *
   * @see https://eslint.org/docs/rules/no-func-assign
   */
  "no-func-assign": "error",

  /**
   * Disallow use of eval()-like methods
   *
   * @see https://eslint.org/docs/rules/no-implied-eval
   */
  "no-implied-eval": "error",

  /**
   * Disallow function or variable declarations in nested blocks
   *
   * @see https://eslint.org/docs/rules/no-inner-declarations
   */
  "no-inner-declarations": "error",

  /**
   * Disallow invalid regular expression strings in the RegExp constructor
   *
   * @see https://eslint.org/docs/rules/no-invalid-regexp
   */
  "no-invalid-regexp": "error",

  /**
   * Disallow irregular whitespace outside of strings and comments
   *
   * @see https://eslint.org/docs/rules/no-irregular-whitespace
   */
  "no-irregular-whitespace": "error",

  /**
   * Disallow usage of __iterator__ property
   *
   * @see https://eslint.org/docs/rules/no-iterator
   */
  "no-iterator": "error",

  /**
   * Disallow labels that share a name with a variable
   *
   * @see https://eslint.org/docs/rules/no-label-var
   */
  "no-label-var": "error",

  /**
   * Disallow use of labeled statements
   *
   * @see https://eslint.org/docs/rules/no-labels
   */
  "no-labels": "error",

  /**
   * Disallow unnecessary nested blocks
   *
   * @see https://eslint.org/docs/rules/no-lone-blocks
   */
  "no-lone-blocks": "warn",

  /**
   * Disallow creation of functions within loops
   *
   * @see https://eslint.org/docs/rules/no-loop-func
   */
  "no-loop-func": "warn",

  /**
   * Disallow mixed spaces and tabs for indentation
   *
   * @see https://eslint.org/docs/rules/no-mixed-spaces-and-tabs
   */
  "no-mixed-spaces-and-tabs": "error",

  /**
   * Disallow use of multiple spaces
   *
   * @see https://eslint.org/docs/rules/no-multi-spaces
   */
  "no-multi-spaces": [
    "error",
    {
      ignoreEOLComments: true,    // allow multiple spaces before end-of-line comments (like this one!)
    }
  ],

  /**
   * Disallow use of multiline strings
   *
   * @see https://eslint.org/docs/rules/no-multi-str
   */
  "no-multi-str": "error",

  /**
   * Disallow reassignments of native objects
   *
   * @see https://eslint.org/docs/rules/no-native-reassign
   */
  "no-native-reassign": "error",

  /**
   * Disallow negation of the left operand of an in expression
   *
   * @see https://eslint.org/docs/rules/no-negated-in-lhs
   */
  "no-negated-in-lhs": "error",

  /**
   * Disallow use of new operator when not part of the assignment or comparison
   *
   * @see https://eslint.org/docs/rules/no-new
   */
  "no-new": "error",

  /**
   * Disallow use of new operator for Function object
   *
   * @see https://eslint.org/docs/rules/no-new-func
   */
  "no-new-func": "error",

  /**
   * Disallow use of the Object constructor
   *
   * @see https://eslint.org/docs/rules/no-new-object
   */
  "no-new-object": "error",

  /**
   * Disallow use of new operator with the require function
   *
   * @see https://eslint.org/docs/rules/no-new-require
   */
  "no-new-require": "error",

  /**
   * Disallows creating new instances of String, Number, and Boolean
   *
   * @see https://eslint.org/docs/rules/no-new-wrappers
   */
  "no-new-wrappers": "error",

  /**
   * Disallow the use of object properties of the global object (Math and JSON) as functions
   *
   * @see https://eslint.org/docs/rules/no-obj-calls
   */
  "no-obj-calls": "error",

  /**
   * Disallow use of octal literals
   *
   * @see https://eslint.org/docs/rules/no-octal
   */
  "no-octal": "error",

  /**
   * Disallow use of octal escape sequences in string literals, such as var foo = "Copyright \050";
   *
   * @see https://eslint.org/docs/rules/no-octal-escape
   */
  "no-octal-escape": "error",

  /**
   * Disallow string concatenation with __dirname and __filename
   *
   * @see https://eslint.org/docs/rules/no-path-concat
   */
  "no-path-concat": "error",

  /**
   * Disallow usage of __proto__ property
   *
   * @see https://eslint.org/docs/rules/no-proto
   */
  "no-proto": "error",

  /**
   * Disallow declaring the same variable more then once
   *
   * @see https://eslint.org/docs/rules/no-redeclare
   */
  "no-redeclare": "error",

  /**
   * Disallow use of javascript: urls.
   *
   * @see https://eslint.org/docs/rules/no-script-url
   */
  "no-script-url": "error",

  /**
   * Disallow comparisons where both sides are exactly the same
   *
   * @see https://eslint.org/docs/rules/no-self-compare
   */
  "no-self-compare": "error",

  /**
   * Disallow use of comma operator
   *
   * @see https://eslint.org/docs/rules/no-sequences
   */
  "no-sequences": "error",

  /**
   * Disallow declaration of variables already declared in the outer scope
   *
   * @see https://eslint.org/docs/rules/no-shadow
   */
  "no-shadow": "warn",

  /**
   * Disallow shadowing of names such as arguments
   *
   * @see https://eslint.org/docs/rules/no-shadow-restricted-names
   */
  "no-shadow-restricted-names": "error",

  /**
   * Disallow sparse arrays
   *
   * @see https://eslint.org/docs/rules/no-sparse-arrays
   */
  "no-sparse-arrays": "error",

  /**
   * Disallow template literals in normal strings
   *
   * @see https://eslint.org/docs/rules/no-template-curly-in-string
   */
  "no-template-curly-in-string": "error",

  /**
   * Disallow use of this/super before calling super() in constructors.
   *
   * @see https://eslint.org/docs/rules/no-this-before-super
   */
  "no-this-before-super": "error",

  /**
   * Disallow throwing non-Error objects
   *
   * @see https://eslint.org/docs/rules/no-throw-literal
   */
  "no-throw-literal": "error",

  /**
   * Disallow trailing whitespace at the end of lines
   *
   * @see https://eslint.org/docs/rules/no-trailing-spaces
   */
  "no-trailing-spaces": "error",

  /**
   * Disallow use of undeclared variables
   *
   * @see https://eslint.org/docs/rules/no-undef
   */
  "no-undef": "error",

  /**
   * Disallow use of undefined when initializing variables
   *
   * @see https://eslint.org/docs/rules/no-undef-init
   */
  "no-undef-init": "error",

  /**
   * Disallow multi-line statements that could be confused for separte ASI statements
   *
   * @see https://eslint.org/docs/rules/no-unexpected-multiline
   */
  "no-unexpected-multiline": "error",

  /**
   * Disallow the use of ternary operators when a simpler alternative exists
   *
   * @see https://eslint.org/docs/rules/no-unneeded-ternary
   */
  "no-unneeded-ternary": "error",

  /**
   * Disallow unreachable statements after a return, throw, continue, or break statement
   *
   * @see https://eslint.org/docs/rules/no-unreachable
   */
  "no-unreachable": "warn",

  /**
   * Disallow unnecessary .call() and .apply()
   *
   * @see https://eslint.org/docs/rules/no-useless-call
   */
  "no-useless-call": "error",

  /**
   * Disallow unnecessary concatenation of string literals
   *
   * @see https://eslint.org/docs/rules/no-useless-concat
   */
  "no-useless-concat": "error",

  /**
   * Require let or const instead of var
   *
   * @see https://eslint.org/docs/rules/no-var
   */
  "no-var": "error",

  /**
   * Disallow use of void operator
   *
   * @see https://eslint.org/docs/rules/no-void
   */
  "no-void": "error",

  /**
   * Disallow use of the with statement
   *
   * @see https://eslint.org/docs/rules/no-with
   */
  "no-with": "error",

  /**
   * Require a space around curly braces in object literals
   *
   * @see https://eslint.org/docs/rules/object-curly-spacing
   */
  "object-curly-spacing": [
    "error",
    "always",
    {
      arraysInObjects: false,
      objectsInObjects: false
    }
  ],

  /**
   * Require method and property shorthand syntax for object literals
   *
   * @see https://eslint.org/docs/rules/object-shorthand
   */
  "object-shorthand": "warn",

  /**
   * Require assignment operator shorthand where possible
   *
   * @see https://eslint.org/docs/rules/operator-assignment
   */
  "operator-assignment": "error",

  /**
   * Use arrow functions instead of anonymous functions for callbacks
   *
   * @see https://eslint.org/docs/rules/prefer-arrow-callback
   */
  "prefer-arrow-callback": [
    "error",
    {
      allowNamedFunctions: true,     // unless the function is named
    }
  ],

  /**
   * Disallow quotes around object literal property names
   *
   * @see https://eslint.org/docs/rules/quote-props
   */
  "quote-props": [
    "warn",
    "as-needed",
  ],

  /**
   * Disallow generator functions that do not have yield
   *
   * @see https://eslint.org/docs/rules/require-yield
   */
  "require-yield": "error",

  /**
   * Enforce spacing after semicolons
   *
   * @see https://eslint.org/docs/rules/semi-spacing
   */
  "semi-spacing": "error",

  /**
   * Disallow space before blocks
   *
   * @see https://eslint.org/docs/rules/space-before-blocks
   */
  "space-before-blocks": "error",

  /**
   * Disallow spaces inside parentheses
   *
   * @see https://eslint.org/docs/rules/space-in-parens
   */
  "space-in-parens": "error",

  /**
   * Require spaces around operators
   *
   * @see https://eslint.org/docs/rules/space-infix-ops
   */
  "space-infix-ops": "error",

  /**
   * Disallow spaces before/after unary operators
   *
   * @see https://eslint.org/docs/rules/space-unary-ops
   */
  "space-unary-ops": "error",

  /**
   * Require a space at the start of a comment
   *
   * @see https://eslint.org/docs/rules/spaced-comment
   */
  "spaced-comment": [
    "error",
    "always",
    {
      line: {
        markers: ["/", "//", "///", "////"],  // allow line comments to start with multiple slashes
      },
      block: {
        markers: ["*", "!", "*!"],            // allow JSDoc block comments
        exceptions: ["*", "-", "=", "+"],     // allow block comments to start with a line of these characters
      },
    },
  ],

  /**
   * Disallow comparisons with the value NaN
   *
   * @see https://eslint.org/docs/rules/use-isnan
   */
  "use-isnan": "error",

  /**
   * Ensure that the results of typeof are compared against a valid string
   *
   * @see https://eslint.org/docs/rules/valid-typeof
   */
  "valid-typeof": "error",

  /**
   * Require immediate function invocation to be wrapped in parentheses
   *
   * @see https://eslint.org/docs/rules/wrap-iife
   */
  "wrap-iife": "error",

  /**
   * Disallow Yoda conditions
   *
   * @see https://eslint.org/docs/rules/yoda
   */
  yoda: "error",
};
