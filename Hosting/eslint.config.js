// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import functional from 'eslint-plugin-functional';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import readableTailwind from 'eslint-plugin-readable-tailwind';

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
  {
    name: 'eslint recommended',
    ...eslint.configs.recommended, // 従来設定における"eslint:recommended"に相当。
  },

  {
    name: 'eslint additional rules',
    rules: {
      'no-implicit-coercion': 'error', // JavaScriptでの演算子による暗黙的な型変換を禁止
      'no-restricted-globals': [
        'error', // 一部のグローバル変数の使用を禁止
        'eval',
        'Boolean',
        'Function',
        'globalThis',
      ],
      // 関数の記述方法を関数式（アロー関数を含む）に統一
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'arrow-body-style': ['error', 'as-needed'], // アロー関数の本体の記述方法を制限
    },
  },

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
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tseslint.plugin.configs?.recommended.rules,
      '@typescript-eslint/strict-boolean-expressions': 'error', // booleanへの型強制を禁止
      '@typescript-eslint/restrict-plus-operands': [
        'error', // TypeScriptでの演算子による暗黙的な型変換を禁止
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
          skipCompoundAssignments: true,
        },
      ],
      // 列挙型に対するswitch文で全ケースの網羅を強制（case列挙漏れの防止）
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/method-signature-style': 'error', // 双変であるメソッド記法の禁止
      '@typescript-eslint/require-array-sort-compare': [
        'error', // Array.prototype.sortデフォルトの文字列比較によるソートを防止
        { ignoreStringArrays: true },
      ],
    },
  },

  {
    name: 'unicorn',
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      globals: globals.builtin,
    },
    rules: {
      'unicorn/prefer-switch': 'error', // 複数else-ifを禁止し、switch文の利用を強制
    },
  },

  // 関数型プログラミングスタイルを推奨するためのルール
  {
    name: 'functional',
    files: ['**/*.{ts,tsx}'],
    plugins: {
      functional,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'functional/no-return-void': 'off', // void型の返り値を許可
      'functional/no-let': [
        'warn', // letの使用を警告
        {
          allowInForLoopInit: true, // for文の初期化式でのletの使用を許可
          allowInFunctions: false, // 関数内でのletの使用を禁止
          ignoreIdentifierPattern: ['^[_#]?mut_'], // mut_, _mut_, #mut_ で始まる変数は許可
        },
      ],
      'functional/immutable-data': [
        'error', // オブジェクトの変更を警告
        {
          ignoreImmediateMutation: true, // 変数に代入する前の即時変更を許可
          ignoreClasses: true, // クラスの変更を許可
          ignoreIdentifierPattern: [
            '^[_#]?mut_', // mut_, _mut_, #mut_ で始まる変数は許可
            'window.location.href',
          ],
          ignoreAccessorPattern: [
            'window.**', // windowオブジェクトの変更を許可
            '**.current.**', // React.useRefのcurrentプロパティへの変更を許可
            '**.displayName', // React componentのdisplayNameプロパティへの変更を許可
            '**.scrollTop', // スクロール位置の変更を許可
          ],
        },
      ],
    },
  },

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
      'react/hook-use-state': 'error', // useStateの返り値の命名を統一
      'react/jsx-no-bind': 'error', // JSX内での関数記述を禁止し、renderごとの関数生成を防止
      'react/jsx-boolean-value': 'error', // boolean型のPropsの渡し方を統一
      'react/jsx-curly-brace-presence': 'error', // 不要な中括弧を禁止
      'react/jsx-no-useless-fragment': 'error', // 不要なReact Fragmentの使用を禁止
      'react/jsx-sort-props': 'error', // Propsの並び順をアルファベット順に強制
      'react/jsx-pascal-case': 'error', // コンポーネント名をパスカルケースに強制
      'react/no-danger': 'error', // dangerouslySetInnerHTMLを許可しない
      'react/self-closing-comp': 'error', // 子要素がない場合は自己終了タグを強制
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // react-hooks
  ...compat.extends('plugin:react-hooks/recommended'),

  // readable-tailwindの設定記述
  {
    plugins: { 'readable-tailwind': readableTailwind },
    rules: {
      // 推奨ルールを警告扱い
      ...readableTailwind.configs.warning.rules,
    },
  },

  // 配列末尾への配置が推奨されている
  eslintConfigPrettier,
);

/**
 * 参考リンク
 * - ESLint を使い倒す（おすすめルール紹介） https://zenn.dev/noshiro_piko/articles/take-full-advantage-of-typescript-eslint
 * - チームで同じような React コンポーネントを書く https://zenn.dev/kazukix/articles/create-similar-react-components
 */
