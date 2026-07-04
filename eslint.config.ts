import { define_lint_config } from "@f0rbit/lint";

export default define_lint_config({
	naming: "camelCase",
	package_name: "@f0rbit/ui",
	tsconfig_root_dir: import.meta.dirname,
	overrides: [
		{
			// tsup.config.ts is root-level TS like eslint.config.ts, but the factory's
			// projectService.allowDefaultProject only allowlists "eslint.config.ts" — it
			// isn't under tsconfig's "include": ["src/**/*"] either (rootDir: "src" means
			// adding it there would break the declaration build). Without this it's a
			// fatal "not found by the project service" parse error under the typed layer.
			// oxlint still covers it untyped; only the type-aware ESLint layer is excluded.
			ignores: ["tsup.config.ts"],
		},
	],
});
