import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
	site: "https://f0rbit.github.io",
	base: "/ui",
	integrations: [
		solidJs(),
		starlight({
			title: "@f0rbit/ui",
			customCss: ["./src/styles/custom.css"],
		components: {
			ThemeSelect: "./src/components/ThemeSelect.astro",
			PageTitle: "./src/components/PageTitle.astro",
			SiteTitle: "./src/components/SiteTitle.astro",
			Footer: "./src/components/Footer.astro",
		},
		social: [{ icon: "github", label: "GitHub", href: "https://github.com/f0rbit/ui" }],
			head: [
				{
					tag: "meta",
					attrs: {
						property: "og:image",
						content: "/ui/og-image.png",
					},
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Installation", slug: "getting-started/installation" },
						{ label: "TypeScript", slug: "getting-started/typescript" },
						{ label: "Theming", slug: "getting-started/theming" },
						{ label: "Troubleshooting", slug: "getting-started/troubleshooting" },
					],
				},
				{
					label: "Components",
					autogenerate: { directory: "components" },
				},
			{
				label: "Guides",
				items: [
					{ label: "Forms", slug: "guides/forms" },
				],
			},
			{
				label: "Patterns",
				items: [
					{ label: "Loading States", slug: "patterns/loading-states" },
					{ label: "Modal Patterns", slug: "patterns/modals" },
					{ label: "Error Handling", slug: "patterns/error-handling" },
				],
			},
			{
				label: "CSS",
				items: [
					{ label: "Design Tokens", slug: "css/tokens" },
					{ label: "Utilities", slug: "css/utilities" },
				],
			},
			{
				label: "Resources",
				items: [
					{ label: "LLM Documentation", slug: "llms" },
					{ label: "OpenCode Setup", slug: "resources/opencode-setup" },
				],
			},
		],
		}),
	],
});
