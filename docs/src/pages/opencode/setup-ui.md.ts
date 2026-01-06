import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
	const commandMd = `---
description: Set up @f0rbit/ui component library with documentation context
---

## Setup @f0rbit/ui

I'll help you set up the @f0rbit/ui SolidJS component library in your project.

### Steps I'll perform:

1. **Install the package** using bun (or npm/pnpm if bun isn't available)
2. **Download the library documentation** as a skill for future AI assistance
3. **Detect project structure** (monorepo vs single package)

### Installation

First, let me check if this is a monorepo or single package project:

\`\`\`bash
ls package.json packages/*/package.json 2>/dev/null | head -5
\`\`\`

Now I'll install the package:

\`\`\`bash
bun add @f0rbit/ui || npm install @f0rbit/ui
\`\`\`

### Setting up the skill

I'll create the OpenCode skill directory and download the documentation:

\`\`\`bash
mkdir -p .opencode/skill/f0rbit-ui && curl -sL https://f0rbit.github.io/ui/opencode/skill.md -o .opencode/skill/f0rbit-ui/SKILL.md
\`\`\`

### Next steps

The library is installed! To use it:

\`\`\`tsx
// Import styles in your app entry point
import "@f0rbit/ui/styles";

// Import and use components
import { Button, Card, Modal } from "@f0rbit/ui";
\`\`\`

The skill is now available. I can load it anytime you need help with @f0rbit/ui components by using the \`skill\` tool with \`f0rbit-ui\`.
`;

	return new Response(commandMd, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Content-Disposition": 'attachment; filename="setup-ui.md"',
		},
	});
};
