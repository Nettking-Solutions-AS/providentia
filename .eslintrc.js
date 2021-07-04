module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
    jasmine: true,
    "jest/globals": true,
    "react-native/react-native": true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:react-native/all",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-native", "@typescript-eslint", "jest", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/no-unescaped-entities": 0,
  },
};
