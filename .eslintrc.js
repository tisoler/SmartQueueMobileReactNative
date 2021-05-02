module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: "babel-eslint",
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "arrow-parens": 0,
    "react/jsx-filename-extension": 0,
    "comma-dangle": 0,
    "react/prop-types": 0,
    "global-require": 0,
    'react/require-default-props': 0
  },
  ignorePatterns: ["web-build/"],
};
