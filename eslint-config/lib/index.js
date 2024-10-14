"use strict";

const universalRules = require("./universal-rules");
const universalJSDocRules = require("./universal-jsdoc-rules");
const javascriptRules = require("./javascript-rules");
const javascriptJSDocRules = require("./javascript-jsdoc-rules");
const javascriptTestRules = require("./javascript-test-rules");

module.exports = {
  plugins: [
    "jsdoc",
  ],
  overrides: [
    /**
     * JavaScript source files
     */
    {
      files: ["**/*.{js,jsx}"],
      excludedFiles: "test/**",
      parserOptions: {
        sourceType: "script",
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: [
        "jsdoc",
      ],
      env: {
        es2020: true,
        commonjs: true,
        "shared-node-browser": true,
      },
      rules: {
        ...universalRules,
        ...universalJSDocRules,
        ...javascriptRules,
        ...javascriptJSDocRules,
      }
    },

    /**
     * JavaScript test files
     */
    {
      files: ["test/**/*.{js,jsx}"],
      parserOptions: {
        sourceType: "script",
        ecmaVersion: 2020,
      },
      ecmaFeatures: {
        jsx: true,
      },
      env: {
        es2020: true,
        commonjs: true,
        "shared-node-browser": true,
        mocha: true,
        jasmine: true,
      },
      rules: {
        ...universalRules,
        ...javascriptRules,
        ...javascriptTestRules,
      }
    },
  ],
};
