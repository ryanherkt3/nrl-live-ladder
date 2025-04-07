import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  ...compat.config({
    env: {
        "browser": true,
        "es2020": true,
        "jquery": true,
        "mocha": true,
        "worker": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "tsx": true,
            "ts": true
        }
    },
    extends: "next/core-web-vitals",
    rules: {
        "brace-style": [2, "stroustrup"],
        "comma-style": [2, "last"],
        "curly": [2, "all"],
        "eol-last": ["error", "always"],
        "func-call-spacing": [2, "never"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "keyword-spacing": [2, {}],
        "max-len": [2, 120],
        "max-params": [2, 7],
        "no-dupe-else-if": 2,
        "no-else-return": 2,
        "no-empty-function": [2, { "allow": ["constructors"] }],
        "no-eq-null": 2,
        "no-eval": 2,
        "no-lone-blocks": 2,
        "no-lonely-if": 2,
        "no-loop-func": 2,
        "no-extra-semi": 1,
        "no-mixed-spaces-and-tabs": 2,
        "no-trailing-spaces": 2,
        "no-unused-expressions": 2,
        "no-unused-vars": [2, {"vars": "local", "args": "after-used"}],
        "prefer-const": [2, {"destructuring": "all"}],
        "prefer-destructuring": [1, {"object": true, "array": false}],
        "quotes": [2, "single", { "avoidEscape": true }],
        "semi": [2, "always"],
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-wrapper-object-types": "off",
    },
  })
];

export default eslintConfig;
