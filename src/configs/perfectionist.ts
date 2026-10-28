import { pluginPerfectionist } from "../plugins";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
  options: OptionsOverrides,
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: "limitlesspc/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-exports": ["warn", { type: "natural" }],
        "perfectionist/sort-imports": [
          "warn",
          {
            customGroups: [
              {
                elementNamePattern: "\\.svelte$",
                groupName: "svelte",
              },
            ],
            groups: ["svelte", "import"],
            type: "natural",
          },
        ],

        ...overrides,
      },
    },
  ];
}
