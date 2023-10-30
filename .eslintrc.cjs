module.exports = {
  extends: [
    'next/core-web-vitals',
    'next',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'import/no-anonymous-default-export': 'off',
    'react/no-unknown-property': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  root: true,
};
