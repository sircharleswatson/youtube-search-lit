module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:wc/recommended",
    "plugin:lit/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
  ],
  "ignorePatterns": [".eslintrc.js"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".js"],
    },
  },
  rules: {
    indent: [
      "error",
      2,
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    quotes: [
      "error",
      "double",
    ],
    semi: [
      "error",
      "never",
    ],
  },
}
