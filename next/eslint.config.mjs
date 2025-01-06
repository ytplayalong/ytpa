import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "error",
    },
  },
];
