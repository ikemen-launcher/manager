import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
    },
  },
  eslintConfigPrettier,
];
