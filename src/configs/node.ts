import { GLOB_SRC } from "../globs";
import { pluginNode } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "limitlesspc/node/setup",
      plugins: {
        node: pluginNode,
      },
    },
    {
      files: [GLOB_SRC],
      name: "limitlesspc/node/rules",
      rules: {
        "node/no-deprecated-api": "error",
        "node/no-exports-assign": "error",
        "node/no-path-concat": "error",
        "node/process-exit-as-throw": "error",
      },
    },
  ];
}
