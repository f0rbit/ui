import type { APIRoute } from "astro";
import { components } from "../../data/components";

export const GET: APIRoute = () => {
	const data = {
		library: "@f0rbit/ui",
		version: "0.1.0",
		description: "A minimal, composable UI component library for SolidJS",
		installation: {
			command: "bun add @f0rbit/ui",
			imports: ['import "@f0rbit/ui/styles";', 'import { Button, Card, Modal } from "@f0rbit/ui";'],
		},
		components: components.map(c => ({
			name: c.name,
			description: c.description,
			import: c.importStatement,
			props: c.props.map(p => ({
				name: p.name,
				type: p.type,
				default: p.default,
				required: !p.default,
				description: p.description,
			})),
			examples: c.examples.map(e => ({
				title: e.title,
				code: e.code,
			})),
		})),
		css: {
			tokens: {
				colors: ["--bg", "--bg-alt", "--border", "--fg", "--fg-muted", "--fg-subtle", "--fg-faint", "--accent", "--success", "--error", "--warning"],
				spacing: ["--space-xs", "--space-sm", "--space-md", "--space-lg", "--space-xl"],
				typography: ["--font", "--font-mono", "--text-sm", "--text-base", "--text-lg", "--text-xl"],
				other: ["--radius", "--radius-lg", "--shadow", "--shadow-lg", "--transition"],
			},
			utilities: {
				layout: [".stack", ".stack-sm", ".stack-lg", ".row", ".row-between", ".grid", ".grid-2", ".grid-3", ".center", ".cluster"],
				text: [".text-primary", ".text-muted", ".text-subtle", ".text-sm", ".text-lg", ".font-medium", ".font-bold", ".truncate"],
			},
		},
	};

	return new Response(JSON.stringify(data, null, 2), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
