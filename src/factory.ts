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
import { e18e } from "./configs/e18e";
import { regexp } from "./configs/regexp";
import type { RuleOptions } from "./typegen";
import type {
  Awaitable,
  ConfigNames,
  OptionsConfig,
  TypedFlatConfigItem,
} from "./types";
import { interopDefault } from "./utils";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";

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
  "@eslint-react": "react",

  "@next/next": "next",
  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-lite": "import",
  "n": "node",
  "vitest": "test",

  "yml": "yaml",
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
  ...userConfigs: Array<
    Awaitable<
      | TypedFlatConfigItem
      | TypedFlatConfigItem[]
      | FlatConfigComposer<any, any>
      | Linter.Config[]
    >
  >
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    e18e: enableE18e = true,
    gitignore: enableGitignore = true,
    ignores: userIgnores = [],
    imports: enableImports = true,
    jsdoc: enableJsdoc = true,
    jsx: enableJsx = true,
    node: enableNode = true,
    perfectionist: enablePerfectionist = true,
    regexp: enableRegexp = true,
    svelte: enableSvelte = false,
    type: appType = "app",
    typescript: enableTypeScript = isPackageExists("typescript")
      || isPackageExists("@typescript/native-preview"),
    unicorn: enableUnicorn = true,
  } = options;

  const { isInEditor } = options;

  const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "limitlesspc/gitignore",
            ...enableGitignore,
          }),
        ]),
      );
    } else {
      configs.push(
        interopDefault(import("eslint-config-flat-gitignore")).then(r => [
          r({
            name: "limitlesspc/gitignore",
            strict: false,
          }),
        ]),
      );
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");

  // Base configs
  configs.push(
    ignores(userIgnores, !enableTypeScript),
    javascript({
      isInEditor,
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
  );

  if (enablePerfectionist) {
    configs.push(
      perfectionist({
        overrides: getOverrides(options, "perfectionist"),
      }),
    );
  }

  if (enableNode) {
    configs.push(node());
  }

  if (enableJsdoc) {
    configs.push(jsdoc());
  }

  if (enableImports) {
    configs.push(imports(resolveSubOptions(options, "imports")));
  }

  if (enableE18e) {
    configs.push(e18e(enableE18e === true ? {} : enableE18e));
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
        type: appType,
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
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length > 0) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(
    ...configs,

    ...(userConfigs as any),
  );

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
  return typeof options[key] === "boolean" ?
      ({} as any)
    : options[key] || ({} as any);
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...(
      options.overrides as
        Record<string, TypedFlatConfigItem["rules"]> | undefined
    )?.[key],
    ...("overrides" in sub ? sub.overrides : {}),
  };
}
