import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.node },
    rules: {
      semi: 'error',
      "no-used-vars": ['error', { args: 'none' }],
      "no-undef": "error"
    },
  },
  pluginJs.configs.recommended,
];
