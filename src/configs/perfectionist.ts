import { pluginPerfectionist } from '../plugins'
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
  options: OptionsOverrides,
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options

  return [
    {
      name: 'limitlesspc/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            customGroups: [
              {
                elementNamePattern: '\\.svelte$',
                groupName: 'svelte',
              },
            ],
            groups: ['svelte', 'import'],
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-named-exports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          { order: 'asc', type: 'natural' },
        ],

        ...overrides,
      },
    },
  ]
}
