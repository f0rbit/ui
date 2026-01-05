import type { APIRoute } from "astro";
import { components } from "../data/components";

export const GET: APIRoute = () => {
	const lines: string[] = [
		"# @f0rbit/ui - SolidJS Component Library",
		"",
		"A minimal, composable UI component library for SolidJS.",
		"",
		"## Installation",
		"",
		"```bash",
		"bun add @f0rbit/ui",
		"```",
		"",
		"```tsx",
		'import "@f0rbit/ui/styles";',
		'import { Button, Card } from "@f0rbit/ui";',
		"```",
		"",
		"## Components",
		"",
	];

	for (const component of components) {
		lines.push(`### ${component.name}`);
		lines.push("");
		lines.push(component.description);
		lines.push("");
		lines.push("```tsx");
		lines.push(component.importStatement);
		lines.push("```");
		lines.push("");

		if (component.props.length > 0) {
			lines.push("Props:");
			for (const prop of component.props) {
				const defaultStr = prop.default ? ` (default: ${prop.default})` : "";
				lines.push(`- \`${prop.name}\`: ${prop.type}${defaultStr} — ${prop.description}`);
			}
			lines.push("");
		}

		if (component.examples.length > 0) {
			lines.push("Example:");
			lines.push("```tsx");
			lines.push(component.examples[0].code);
			lines.push("```");
			lines.push("");
		}
	}

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
