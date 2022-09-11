module.exports = {
  env: { browser: true, node: true, es6: true },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "prettier"],
  settings: {
    jsdoc: { mode: "typescript" },
    react: { version: "detect" },
  },
  rules: {},
};
