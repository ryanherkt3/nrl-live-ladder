import { defineConfig } from 'eslint/config';
import eslintPlugin from '@eslint/js';
import { configs as tseslintConfigs } from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';

const ignoresConfig = defineConfig([
    {
        name: 'project/ignores',
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'next.config.mjs',
            'scripts/**',
        ]
    },
]);

const eslintConfig = defineConfig([
    {
        name: 'project/javascript-recommended',
        files: ['**/*.{js,mjs,ts,tsx}'],
        ...eslintPlugin.configs.recommended,
    },
]);

const typescriptConfig = defineConfig([
    {
        name: 'project/typescript-strict',
        files: ['**/*.{ts,tsx,mjs}'],
        extends: [
            ...tseslintConfigs.strictTypeChecked,
            ...tseslintConfigs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
                warnOnUnsupportedTypeScriptVersion: true,
            },
        },
        rules: {},
    },
    {
        name: 'project/javascript-disable-type-check',
        files: ['**/*.{js,mjs,cjs}'],
        ...tseslintConfigs.disableTypeChecked,
    }
]);

const reactConfig = defineConfig([
    {
        name: 'project/react-next',
        files: ['**/*.{jsx,js,mjs,tsx,ts}'],
        plugins: {
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            '@next/next': nextPlugin,
        },
        rules: {
            'brace-style': [2, 'stroustrup'],
            'comma-style': [2, 'last'],
            'curly': [2, 'all'],
            'eol-last': ['error', 'always'],
            'func-call-spacing': [2, 'never'],
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            'keyword-spacing': [2, {}],
            'max-len': [2, 120],
            'max-params': [2, 7],
            'no-dupe-else-if': 2,
            'no-else-return': 2,
            'no-empty-function': [2, { 'allow': ['constructors'] }],
            'no-eq-null': 2,
            'no-eval': 2,
            'no-extra-semi': 1,
            'no-lone-blocks': 2,
            'no-lonely-if': 2,
            'no-loop-func': 2,
            'no-mixed-spaces-and-tabs': 2,
            'no-negated-condition': 2,
            'no-trailing-spaces': 2,
            'no-unused-expressions': 2,
            'no-unused-vars': [2, {'vars': 'local', 'args': 'after-used', 'argsIgnorePattern': '^_'}],
            'prefer-const': [2, {'destructuring': 'all'}],
            'prefer-destructuring': [1, {'object': true, 'array': false}],
            'quotes': [2, 'single', { 'avoidEscape': true }],
            'semi': [2, 'always'],
            '@typescript-eslint/no-dynamic-delete': 'off'
        },
        settings: {
            react: {
                version: 'detect',
            },
        }
    }
]);

export default defineConfig([
    ...ignoresConfig,
    ...eslintConfig,
    ...typescriptConfig,
    ...reactConfig,
]);
