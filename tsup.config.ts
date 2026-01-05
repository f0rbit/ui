import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.tsx"],
	format: ["esm"],
	dts: true,
	clean: true,
	external: ["solid-js"],
	esbuildOptions(options) {
		options.jsx = "preserve";
		options.jsxImportSource = "solid-js";
	},
});
