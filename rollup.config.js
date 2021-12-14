import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default (commandLineArgs) => ({
  input: commandLineArgs.configWithTests
    ? "src/ObsidianZoomPluginWithTests.ts"
    : "src/ObsidianZoomPlugin.ts",
  output: {
    file: "main.js",
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
  },
  external: [
    "obsidian",
    "codemirror",
    "@codemirror/fold",
    "@codemirror/language",
    "@codemirror/state",
    "@codemirror/view",
  ],
  plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
});
