/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  jsxSingleQuote: false,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  useTabs: false,
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  plugins: [],
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
}