import type { Linter } from "eslint";
import type { RuleOptions } from "./typegen";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from "./types";

import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
  comments,
  disables,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  node,
  perfectionist,
  sortPackageJson,
  sortTsconfig,
  svelte,
  typescript,
  unicorn,
} from "./configs";
import { regexp } from "./configs/regexp";
import { interopDefault } from "./utils";

const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies Array<keyof TypedFlatConfigItem>;

export const defaultPluginRenaming = {
  "@typescript-eslint": "ts",
  "import-lite": "import",
  "n": "node",
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function limitlesspc(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files" | "ignores"> = {},
  ...userConfigs: Awaitable<
    | TypedFlatConfigItem
    | TypedFlatConfigItem[]
    | FlatConfigComposer<any, any>
    | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    gitignore: enableGitignore = true,
    ignores: userIgnores = [],
    imports: enableImports = true,
    jsx: enableJsx = true,
    regexp: enableRegexp = true,
    svelte: enableSvelte = false,
    typescript: enableTypeScript = isPackageExists("typescript"),
    unicorn: enableUnicorn = true,
  } = options;

  const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "antfu/gitignore",
            ...enableGitignore,
          }),
        ]),
      );
    } else {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "antfu/gitignore",
            strict: false,
          }),
        ]),
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");

  configs.push(
    ignores(options.ignores),
    javascript({
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
    node(),
    jsdoc(),
    perfectionist(),
  );

  if (enableImports) {
    configs.push(imports(enableImports === true ? {} : enableImports));
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableJsx) {
    configs.push(jsx());
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, "typescript"),
      }),
    );
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
  }

  if (enableSvelte) {
    configs.push(
      svelte({
        overrides: getOverrides(options, "svelte"),
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, "jsonc"),
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  configs.push(disables());

  if ("files" in options) {
    throw new Error(
      '[@limitlesspc/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = {} as TypedFlatConfigItem;
  for (const key of flatConfigProps) {
    if (key in options) {
      fusedConfig[key] = options[key] as any;
    }
  }
  if (Object.keys(fusedConfig).length) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...(options.overrides as any)?.[key],
    ...("overrides" in sub ? sub.overrides : {}),
  };
}
