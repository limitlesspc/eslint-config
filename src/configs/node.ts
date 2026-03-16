import { pluginNode } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "limitlesspc/node/rules",
      plugins: {
        node: pluginNode,
      },
      rules: {
        "node/no-deprecated-api": "error",
        "node/no-exports-assign": "error",
        "node/no-path-concat": "error",
        "node/process-exit-as-throw": "error",
      },
    },
  ];
}
