import { limitlesspc } from "./src";

export default limitlesspc(
  {
    typescript: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
