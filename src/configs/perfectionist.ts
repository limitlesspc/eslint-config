import { pluginPerfectionist } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "limitlesspc/perfectionist/setup",
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        "perfectionist/sort-exports": [
          "warn",
          {
            type: "natural",
          },
        ],
        "perfectionist/sort-imports": [
          "warn",
          {
            customGroups: {
              value: {
                svelte: ["\\.svelte$"],
              },
            },
            groups: ["svelte", "import"],
            type: "natural",
          },
        ],
      },
    },
  ];
}
