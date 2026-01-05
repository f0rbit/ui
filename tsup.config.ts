import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const presetOptions: preset.PresetOptions = {
	entries: [
		{
			entry: "src/index.tsx",
			server_entry: true,
		},
	],
	drop_console: true,
	cjs: false,
};

export default defineConfig(config => {
	const watching = !!config.watch;
	const parsed = preset.parsePresetOptions(presetOptions, watching);
	return preset.generateTsupOptions(parsed);
});
