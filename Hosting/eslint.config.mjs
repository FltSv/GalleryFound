import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import typeScriptEsLint from '@typescript-eslint/eslint-plugin';
import typeScriptEsLintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  // lint対象ファイルの設定
  // fileのみ、ignoresのみの設定項目を作ることで、指定した内容が他の項目にも引き継がれる
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
  },
  {
    ignores: ['eslint.config.js'],
  },

  // eslintの推奨ルールを使用
  js.configs.recommended, // 従来設定における"eslint:recommended"に相当。

  eslintConfigPrettier,

  // グローバル変数の設定
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: typeScriptEsLintParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
  },

  // typescript-eslint
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': typeScriptEsLint,
    },
    rules: {
      ...typeScriptEsLint.configs.recommended.rules,
      ...typeScriptEsLint.configs['recommended-type-checked'].rules,
      ...typeScriptEsLint.configs.strict.rules,
      ...typeScriptEsLint.configs['strict-type-checked'].rules,
      ...typeScriptEsLint.configs.stylistic.rules,
    },
  },

  // react
  {
    plugins: {
      'react': reactPlugin,
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
