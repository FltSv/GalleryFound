// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Hostingディレクトリで 'npx eslint --inspect-config' 実行で設定確認が可能

export default tseslint.config(
  // lint対象ファイルの設定
  // fileのみ、ignoresのみの設定項目を作ることで、指定した内容が他の項目にも引き継がれる
  {
    // 設定ファイル、node_modules、publicディレクトリは無視
    name: 'global ignores',
    ignores: ['*.{js,cjs,mjs}', 'public/**/*', 'node_modules/**/*'],
  },

  // eslintの推奨ルールを使用
  eslint.configs.recommended, // 従来設定における"eslint:recommended"に相当。

  // グローバル変数の設定
  {
    name: 'global variables',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        google: 'readonly',
      },
    },
  },

  // typescript-eslint
  {
    name: 'typescript-eslint',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tseslint.plugin.configs?.recommended.rules,
      '@typescript-eslint/strict-boolean-expressions': 'error', // booleanへの型強制を禁止
    },
  },

  // react
  {
    name: 'react',
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // @ts-ignore
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // react-hooks
  ...compat.extends('plugin:react-hooks/recommended'),

  // 配列末尾への配置が推奨されている
  eslintConfigPrettier,
);
