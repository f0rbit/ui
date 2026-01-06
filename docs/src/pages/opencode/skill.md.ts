import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  // Fetch the llms.txt content from the docs site
  const llmsResponse = await fetch("https://f0rbit.github.io/ui/llms.txt");
  const llmsContent = await llmsResponse.text();

  const skillMd = `---
name: f0rbit-ui
description: Context and documentation for the @f0rbit/ui SolidJS component library. Load this skill when working with @f0rbit/ui components.
license: MIT
compatibility: opencode
metadata:
  type: library
  framework: solidjs
---

## About @f0rbit/ui

This skill provides documentation context for the @f0rbit/ui SolidJS component library.

## When to Use

Load this skill when:
- Creating new components using @f0rbit/ui
- Debugging @f0rbit/ui component issues
- Understanding available components and their props
- Working with @f0rbit/ui theming and CSS tokens

## Library Documentation

${llmsContent}
`;

  return new Response(skillMd, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="SKILL.md"',
    },
  });
};
