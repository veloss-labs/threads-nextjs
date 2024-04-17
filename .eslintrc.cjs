const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@vercel/style-guide/eslint/node',
    '@vercel/style-guide/eslint/typescript',
    '@vercel/style-guide/eslint/browser',
    '@vercel/style-guide/eslint/react',
    '@vercel/style-guide/eslint/next',
  ]
    .map(require.resolve)
    .concat('plugin:tailwindcss/recommended'),
  root: true,
  parserOptions: {
    project,
  },
  rules: {
    'unicorn/filename-case': 'off',
    'no-console': 'off',
    'import/order': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/named': 'off',
    'import/no-default-export': 'off',
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-pascal-case': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
  },
  globals: {
    React: true,
    JSX: true,
  },
  ignorePatterns: [
    '**/.eslintrc.*',
    '**/tailwind.config.*',
    '**/postcss.config.*',
    '**/.prettier.*',
    '.next',
    '.sst',
    'dist',
    'build',
    'pnpm-lock.yaml',
    'node_modules',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
