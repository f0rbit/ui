import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const srcDir = join(rootDir, "src");
const componentsDir = join(srcDir, "components");
const stylesDir = join(srcDir, "styles");
const docsDir = join(rootDir, "docs/src/content/docs");
const componentDocsDir = join(docsDir, "components");

// Read package.json for metadata
const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));

// Get all component files
const componentFiles = readdirSync(componentsDir).filter(f => f.endsWith(".tsx"));

// Get all CSS files
const cssFiles = ["tokens.css", "reset.css", "utilities.css", "components.css"];

// Extract code examples from mdx content
function extractExamples(mdxContent) {
	const examples = [];
	const codeBlockRegex = /```tsx\n([\s\S]*?)```/g;
	let match;
	
	while ((match = codeBlockRegex.exec(mdxContent)) !== null) {
		examples.push(match[1].trim());
	}
	
	return examples;
}

// Get documentation for a component from its mdx file
function getComponentDocs(componentName) {
	const mdxPath = join(componentDocsDir, `${componentName.toLowerCase()}.mdx`);
	
	if (!existsSync(mdxPath)) {
		return null;
	}
	
	const content = readFileSync(mdxPath, "utf-8");
	const examples = extractExamples(content);
	
	// Extract description from frontmatter
	const descMatch = content.match(/description:\s*(.+)/);
	const description = descMatch ? descMatch[1].trim() : "";
	
	return {
		description,
		examples
	};
}

// Generate component documentation
function extractComponentInfo(filename) {
	const content = readFileSync(join(componentsDir, filename), "utf-8");
	const name = filename.replace(".tsx", "");
	
	// Extract interface/type definitions
	const interfaceMatch = content.match(/export interface (\w+Props)[^{]*\{([^}]+)\}/g) || [];
	const typeMatch = content.match(/export type (\w+) = ([^;]+);/g) || [];
	
	// Extract export names
	const exportMatch = content.match(/export function (\w+)/g) || [];
	const exports = exportMatch.map(e => e.replace("export function ", ""));
	
	// Get docs/examples
	const docs = getComponentDocs(name);
	
	return {
		name,
		exports,
		interfaces: interfaceMatch.join("\n\n"),
		types: typeMatch.join("\n"),
		source: content,
		description: docs?.description || "",
		examples: docs?.examples || []
	};
}

// Generate llms.txt (concise version)
function generateLlmsTxt() {
	let output = `# ${pkg.name} v${pkg.version}

> ${pkg.description}

## Installation

\`\`\`bash
bun add ${pkg.name}
# or
npm install ${pkg.name}
\`\`\`

## Setup

\`\`\`tsx
// Import styles in your app entry
import "${pkg.name}/styles.css";

// Import components
import { Button, Card, Modal } from "${pkg.name}";
\`\`\`

## Components

`;

	for (const file of componentFiles) {
		const info = extractComponentInfo(file);
		output += `### ${info.name}\n`;
		if (info.description) {
			output += `${info.description}\n\n`;
		}
		output += `**Exports:** ${info.exports.join(", ")}\n\n`;
		
		if (info.examples.length > 0) {
			output += `**Examples:**\n\n`;
			for (const example of info.examples) {
				output += `\`\`\`tsx\n${example}\n\`\`\`\n\n`;
			}
		}
		output += `---\n\n`;
	}

	output += `## CSS Tokens

The library uses CSS custom properties for theming. Key tokens:

- \`--bg\`, \`--bg-alt\` - Background colors
- \`--fg\`, \`--fg-muted\`, \`--fg-subtle\`, \`--fg-faint\` - Text colors  
- \`--accent\`, \`--accent-fg\` - Accent/primary colors
- \`--border\` - Border color
- \`--radius\`, \`--radius-lg\` - Border radius
- \`--space-xs\`, \`--space-sm\`, \`--space-md\`, \`--space-lg\`, \`--space-xl\` - Spacing
- \`--text-xs\`, \`--text-sm\`, \`--text-base\`, \`--text-lg\`, \`--text-xl\` - Font sizes

## Utility Classes

- \`.stack\`, \`.stack-sm\`, \`.stack-lg\` - Vertical flex layouts
- \`.row\`, \`.row-sm\`, \`.row-lg\` - Horizontal flex layouts  
- \`.grid\`, \`.grid-2\`, \`.grid-3\`, \`.grid-4\` - Grid layouts
- \`.text-primary\`, \`.text-muted\`, \`.text-subtle\`, \`.text-faint\` - Text colors
- \`.truncate\`, \`.sr-only\`, \`.hidden\` - Utilities

## Links

- Documentation: https://f0rbit.github.io/ui
- Repository: ${pkg.repository.url}
`;

	return output;
}

// Generate llms-full.txt (comprehensive version with all source)
function generateLlmsFullTxt() {
	let output = `# ${pkg.name} v${pkg.version} - Full Documentation

> ${pkg.description}

This document contains the complete source code and documentation for LLM consumption.

## Installation

\`\`\`bash
bun add ${pkg.name}
\`\`\`

## Setup

\`\`\`tsx
import "${pkg.name}/styles.css";
import { Button, Card, Modal } from "${pkg.name}";
\`\`\`

---

## Components

`;

	for (const file of componentFiles) {
		const info = extractComponentInfo(file);
		output += `### ${info.name}

\`\`\`tsx
${info.source}
\`\`\`

---

`;
	}

	output += `## Styles

`;

	for (const file of cssFiles) {
		const content = readFileSync(join(stylesDir, file), "utf-8");
		output += `### ${file}

\`\`\`css
${content}
\`\`\`

---

`;
	}

	return output;
}

// Generate docs page for LLM files
function generateDocsPage() {
	return `---
title: "LLM Documentation"
description: Machine-readable documentation for AI assistants
---

This library provides machine-readable documentation files for use with Large Language Models (LLMs) and AI coding assistants.

## Available Files

### llms.txt

A concise overview of the library including:
- Installation instructions
- Component list with exports
- CSS tokens reference
- Utility classes

**URL:** [\`/ui/llms.txt\`](/ui/llms.txt)

### llms-full.txt

Complete documentation including full source code for all components and styles. Use this when you need the AI to understand implementation details.

**URL:** [\`/ui/llms-full.txt\`](/ui/llms-full.txt)

## Usage with AI Assistants

You can provide these URLs to AI assistants to give them context about the library:

\`\`\`
Please read https://f0rbit.github.io/ui/llms.txt for documentation about @f0rbit/ui
\`\`\`

Or for full source access:

\`\`\`
Please read https://f0rbit.github.io/ui/llms-full.txt to understand the @f0rbit/ui component implementations
\`\`\`
`;
}

// Write files
const llmsTxt = generateLlmsTxt();
const llmsFullTxt = generateLlmsFullTxt();
const docsPage = generateDocsPage();

// Write to docs/public for static serving
writeFileSync(join(rootDir, "docs/public/llms.txt"), llmsTxt);
console.log("✓ docs/public/llms.txt");

writeFileSync(join(rootDir, "docs/public/llms-full.txt"), llmsFullTxt);
console.log("✓ docs/public/llms-full.txt");

// Write docs page
writeFileSync(join(docsDir, "llms.mdx"), docsPage);
console.log("✓ docs/src/content/docs/llms.mdx");

console.log("\nLLM docs generated!");
