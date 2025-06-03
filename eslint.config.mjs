import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

import prettierExtends from "eslint-config-prettier";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

const globalToUse = {
  ...globals.browser,
  ...globals.serviceworker,
  ...globals.es2021,
  ...globals.worker,
  ...globals.node,
};

export default tseslint.config([
  {
    extends: [
      {
        ignores: ["dist/**", "bin/**", "docs/**", ".yarn/**"],
      },
      prettierExtends,
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    plugins: {
      prettierPlugin,
      "unused-imports": fixupPluginRules(unusedImportsPlugin),
    },
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-useless-escape": "off",
      "no-prototype-builtins": "off",
      "no-undef": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
    languageOptions: {
      globals: globalToUse,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  globalIgnores([".yarn/", ".expo/", ".idea/", "android/", "ios/"]),
]);
