import limitlesspcPrettierConfig from '@limitlesspc/prettier-config'

/** @type {import("prettier").Config} */
const config = {
  ...limitlesspcPrettierConfig,
  arrowParens: 'always',
  semi: false,
  singleQuote: true,
}
export default config
