import { limitlesspc } from "./src";

export default limitlesspc(
  {
    svelte: true,
    typescript: {
      erasableOnly: true,
    },
    type: "lib",
    jsx: true,
  },
  {
    ignores: ["fixtures", "_fixtures", "**/constants-generated.ts"],
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
