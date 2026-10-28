import type { RuleOptions } from "./typegen";
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { ConfigWithExtends } from "eslint-flat-config-utils";

export type Awaitable<T> = T | Promise<T>;

export type Rules = Record<string, Linter.RuleEntry<any> | undefined>
  & RuleOptions;

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<
  ConfigWithExtends,
  "plugins" | "rules"
> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */

  plugins?: Record<string, any>;

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules;
};

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export type OptionsTypescript =
  | (OptionsTypeScriptWithTypes
      & OptionsOverrides
      & OptionsTypeScriptErasableOnly)
  | (OptionsTypeScriptParserOptions
      & OptionsOverrides
      & OptionsTypeScriptErasableOnly);

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsE18e extends OptionsOverrides {
  /**
   * Include modernization rules
   *
   * @see https://github.com/e18e/eslint-plugin#modernization
   * @default true
   */
  modernization?: boolean;
  /**
   * Include module replacements rules
   *
   * @see https://github.com/e18e/eslint-plugin#module-replacements
   * @default type === 'lib' && isInEditor
   */
  moduleReplacements?: boolean;
  /**
   * Include performance improvements rules
   *
   * @see https://github.com/e18e/eslint-plugin#performance-improvements
   * @default true
   */
  performanceImprovements?: boolean;
}

export interface OptionsUnicorn extends OptionsOverrides {}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem["rules"];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: "app" | "lib";
}

export interface OptionsTypeScriptErasableOnly {
  /**
   * Enable erasable syntax only rules.
   *
   * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
   * @default false
   */
  erasableOnly?: boolean;
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: "error" | "warn";
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsConfig
  extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @default true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Extend the global ignores.
   *
   * Passing an array to extends the ignores.
   * Passing a function to modify the default ignores.
   *
   * @default []
   */
  ignores?: string[] | ((originals: string[]) => string[]);

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable Node.js rules
   *
   * @default true
   */
  node?: boolean;

  /**
   * Enable JSDoc rules
   *
   * @default true
   */
  jsdoc?: boolean;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean;

  /**
   * Options for [@e18e/eslint-plugin](https://github.com/e18e/eslint-plugin)
   *
   * @default true
   */
  e18e?: boolean | OptionsE18e;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
   * Options for eslint-plugin-perfectionist.
   *
   * @default true
   */
  perfectionist?: boolean | OptionsOverrides;

  /**
   * Options for eslint-plugin-import-lite.
   *
   * @default true
   */
  imports?: boolean | OptionsOverrides;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides);

  /**
   * Enable svelte rules.
   *
   * Requires installing:
   * - `eslint-plugin-svelte`
   *
   * @default false
   */
  svelte?: boolean | OptionsOverrides;

  /**
   * Control to disable some rules in editors.
   * @default auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    javascript?: TypedFlatConfigItem["rules"];
    typescript?: TypedFlatConfigItem["rules"];
    jsonc?: TypedFlatConfigItem["rules"];
    svelte?: TypedFlatConfigItem["rules"];
  };
}

export { type RuleOptions, type ConfigNames } from "./typegen";
