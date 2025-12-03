import fs from "node:fs/promises";

import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { limitlesspc } from "../src/factory";

const configs = await limitlesspc({
  imports: true,
  jsonc: true,
  regexp: true,
  gitignore: true,
  svelte: true,
  typescript: {
    tsconfigPath: "tsconfig.json",
    erasableOnly: true,
  },
  unicorn: true,
}).prepend({
  plugins: {
    "": {
      rules: Object.fromEntries(builtinRules.entries()),
    },
  },
});

const configNames = configs.map((i) => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map((i) => `'${i}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
