
import { limitlesspc } from './src'

export default limitlesspc(
  {
    svelte: true,
    typescript: true,
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'perfectionist/sort-objects': 'error',
    },
  },
)
