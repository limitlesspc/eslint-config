import { limitlesspc } from "./src";

export default limitlesspc(
  {
    type: "lib",
    typescript: true,
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "perfectionist/sort-objects": "error",
    },
  },
);
