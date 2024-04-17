import { fileURLToPath } from 'node:url';

/**
 * Some of Prettier's defaults can be overridden by an EditorConfig file. We
 * define those here to ensure that doesn't happen.
 *
 * See: https://github.com/prettier/prettier/blob/main/docs/configuration.md#editorconfig
 * @type {import('prettier').Config}
 */

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

const overridableDefaults = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
};

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = Object.assign({}, overridableDefaults, {
  semi: true,
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  trailingComma: 'all',
  plugins: [
    'prettier-plugin-packagejson',
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindConfig: fileURLToPath(
    new URL('./tailwind.config.cjs', import.meta.url),
  ),
  tailwindFunctions: ['cn', 'cva'],
  importOrder: [
    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>',
    '<TYPES>^[.|..|~]',
    '',
    '^~/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
});

export default config;
