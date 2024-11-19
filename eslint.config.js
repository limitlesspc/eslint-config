import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { limitlesspc } = await jiti.import("./src");

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
