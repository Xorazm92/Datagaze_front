import { renovamen } from "@renovamen/eslint-config";

const configs = renovamen({
  files: ["**/*.ts", "**/*.tsx"],
  ignores: ["src/auto-imports.d.ts"],
  rules: {
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/jsx-no-undef": "off"
  }
});

export default configs;
