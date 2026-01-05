# Documentation Site Implementation Plan

## Overview

Build a Starlight-based documentation site for `@f0rbit/ui` with interactive demos and LLM-friendly endpoints.

**Location:** `~/dev/ui/docs/`
**Stack:** Astro + Starlight + SolidJS

## Phase 0: Foundation

- [x] 0.1 Initialize Astro + Starlight project in `docs/`
- [x] 0.2 Configure workspace linking to parent `@f0rbit/ui`
- [x] 0.3 Create CSS token mapping layer (`custom.css`)
- [x] 0.4 Verify SolidJS integration works with `client:` directives

## Phase 1: Core Infrastructure

- [x] 1.1 Create `DemoContainer.tsx` — wrapper with border, title
- [x] 1.2 Create `CodeBlock.tsx` — syntax highlighted, copyable code
- [x] 1.3 Create `PropsTable.tsx` — renders props from metadata
- [x] 1.4 Create `data/components.ts` — component metadata schema & data

## Phase 2: Content Pages

### Getting Started
- [x] 2.A.1 Homepage (`index.mdx`)
- [x] 2.A.2 Installation guide (`installation.mdx`)
- [x] 2.A.3 Theming guide (`theming.mdx`)

### Component Pages
- [x] 2.B.1 `ButtonDemo.tsx` + `button.mdx`
- [x] 2.B.2 `BadgeDemo.tsx` + `badge.mdx`
- [x] 2.B.3 `CardDemo.tsx` + `card.mdx`
- [x] 2.B.4 `ModalDemo.tsx` + `modal.mdx`
- [x] 2.B.5 `DropdownDemo.tsx` + `dropdown.mdx`
- [x] 2.B.6 `CollapsibleDemo.tsx` + `collapsible.mdx`
- [x] 2.B.7 `StepperDemo.tsx` + `stepper.mdx`
- [x] 2.B.8 `InputDemo.tsx` + `input.mdx`
- [x] 2.B.9 `StatusDemo.tsx` + `status.mdx`
- [x] 2.B.10 `StatDemo.tsx` + `stat.mdx`
- [x] 2.B.11 `SpinnerDemo.tsx` + `spinner.mdx`
- [x] 2.B.12 `EmptyDemo.tsx` + `empty.mdx`
- [x] 2.B.13 `ClampDemo.tsx` + `clamp.mdx`
- [x] 2.B.14 `ChevronDemo.tsx` + `chevron.mdx`

### CSS Documentation
- [x] 2.C.1 `tokens.mdx` — design token reference
- [x] 2.C.2 `utilities.mdx` — layout primitives reference

## Phase 3: LLM Endpoint

- [x] 3.1 Create helper function to generate LLM content from metadata
- [x] 3.2 Create `llms.txt.ts` — plain text endpoint
- [x] 3.3 Create `api/llms.json.ts` — structured JSON endpoint

## Phase 4: Polish & Configuration

- [x] 4.1 Configure Starlight sidebar navigation
- [x] 4.2 Add search configuration
- [x] 4.3 Configure social links / footer

---

## Directory Structure

```
docs/
├── src/
│   ├── content/
│   │   └── docs/
│   │       ├── index.mdx
│   │       ├── getting-started/
│   │       │   ├── installation.mdx
│   │       │   └── theming.mdx
│   │       ├── components/
│   │       │   ├── button.mdx
│   │       │   ├── badge.mdx
│   │       │   └── ... (all components)
│   │       └── css/
│   │           ├── tokens.mdx
│   │           └── utilities.mdx
│   ├── components/
│   │   ├── demos/
│   │   │   ├── ButtonDemo.tsx
│   │   │   └── ... (all demos)
│   │   └── shared/
│   │       ├── DemoContainer.tsx
│   │       ├── CodeBlock.tsx
│   │       └── PropsTable.tsx
│   ├── pages/
│   │   ├── llms.txt.ts
│   │   └── api/
│   │       └── llms.json.ts
│   ├── data/
│   │   └── components.ts
│   └── styles/
│       └── custom.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## CSS Token Mapping

```css
:root {
  --sl-color-bg: var(--bg);
  --sl-color-bg-nav: var(--bg);
  --sl-color-bg-sidebar: var(--bg-alt);
  --sl-color-text: var(--fg-muted);
  --sl-color-text-accent: var(--accent);
  --sl-color-hairline: var(--border);
  --sl-font: var(--font);
  --sl-font-mono: var(--font-mono);
}
```

## LLM Endpoint Formats

### /llms.txt (plain text)
```
# @f0rbit/ui - SolidJS Component Library

## Components

### Button
A clickable button component with multiple variants.

Props:
- variant: "primary" | "secondary" | "ghost" | "danger"
- size: "sm" | "md" | "lg"
...
```

### /api/llms.json (structured)
```json
{
  "library": "@f0rbit/ui",
  "components": [
    {
      "name": "Button",
      "props": [...],
      "examples": [...]
    }
  ]
}
```
