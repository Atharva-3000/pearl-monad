import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
    },
  },
];

export default eslintConfig