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
					items: [
						{ label: "Button", slug: "components/button" },
						{ label: "Badge", slug: "components/badge" },
						{ label: "Card", slug: "components/card" },
						{ label: "Modal", slug: "components/modal" },
						{ label: "Dropdown", slug: "components/dropdown" },
						{ label: "Collapsible", slug: "components/collapsible" },
						{ label: "Tabs", slug: "components/tabs" },
						{ label: "Stepper", slug: "components/stepper" },
						{ label: "Input", slug: "components/input" },
						{ label: "Status", slug: "components/status" },
						{ label: "Stat", slug: "components/stat" },
						{ label: "Spinner", slug: "components/spinner" },
						{ label: "Empty", slug: "components/empty" },
						{ label: "Clamp", slug: "components/clamp" },
						{ label: "Chevron", slug: "components/chevron" },
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
