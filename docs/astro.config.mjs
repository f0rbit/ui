import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
	integrations: [
		solidJs(),
		starlight({
			title: "@f0rbit/ui",
			customCss: ["./src/styles/custom.css"],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Installation", slug: "getting-started/installation" },
						{ label: "Theming", slug: "getting-started/theming" },
					],
				},
			],
		}),
	],
});
