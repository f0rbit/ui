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
						{ label: "Theming", slug: "getting-started/theming" },
					],
				},
				{
					label: "Components",
					autogenerate: { directory: "components" },
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
