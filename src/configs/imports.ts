import { pluginAntfu, pluginImportLite } from "../plugins";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

export async function imports(
  options: OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: "limitlesspc/imports/rules",
      plugins: {
        antfu: pluginAntfu,
        import: pluginImportLite,
      },
      rules: {
        "antfu/import-dedupe": "error",
        "antfu/no-import-dist": "error",
        "antfu/no-import-node-modules-by-path": "error",

        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/first": "error",
        "import/newline-after-import": ["warn", { considerComments: true }],
        "import/no-duplicates": ["error", { "prefer-inline": true }],
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "no-duplicate-imports": "off", // use import/no-duplicates
        "unicorn/no-named-default": "off", // use no-named-default

        ...overrides,
      },
    },
  ];
}
