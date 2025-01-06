import { fixupPluginRules } from "@eslint/compat";
import _import from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    plugins: {
      import: fixupPluginRules(_import),
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "error",
    },
  },
];
