import type { OptionsConfig } from "./types";

// @keep-sorted
export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  gitignore: true,
  imports: true,
  jsdoc: true,
  jsonc: true,
  jsx: true,
  node: true,
  regexp: true,
  svelte: true,
  typescript: {
    erasableOnly: true,
    tsconfigPath: "tsconfig.json",
  },
  unicorn: true,
};

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  gitignore: false,
  imports: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  node: false,
  regexp: false,
  svelte: false,
  typescript: false,
  unicorn: false,
};
