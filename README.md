# @f0rbit/ui

A minimal, composable UI component library for SolidJS.

## Philosophy

This library is built on a few core principles:

- **Minimalism over features** - Ship only what's needed. No bloated dependencies, no unnecessary abstractions.
- **CSS-first styling** - Components are styled via CSS classes and custom properties, not runtime style objects. This enables layered customization through CSS cascade.
- **Composable architecture** - Components like `Card`, `Modal`, and `Dropdown` are built from smaller primitives (`CardHeader`, `CardTitle`, `ModalBody`, etc.) that can be mixed and matched.
- **Semantic markup** - Components render sensible HTML elements with proper accessibility attributes (ARIA labels, keyboard handling).
- **Zero runtime styling dependencies** - Styles ship as plain CSS. No CSS-in-JS, no build-time extraction magic.

## Installation

```bash
bun add @f0rbit/ui solid-js
```

## Usage

Import components and styles:

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@f0rbit/ui";
import "@f0rbit/ui/styles";
```

Use in your SolidJS app:

```tsx
function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### CSS Imports

Import all styles at once:

```css
@import "@f0rbit/ui/styles";
```

Or import layers individually for finer control:

```css
@import "@f0rbit/ui/styles/tokens";     /* Design tokens (colors, spacing, typography) */
@import "@f0rbit/ui/styles/reset";      /* CSS reset */
@import "@f0rbit/ui/styles/utilities";  /* Layout utilities (.stack, .row, .grid, etc.) */
@import "@f0rbit/ui/styles/components"; /* Component styles */
```

### Customization

Override design tokens via CSS custom properties:

```css
:root {
  --accent: oklch(60% 0.15 250);
  --radius: 0.5rem;
  --space-md: 1rem;
}
```

Dark mode is automatic via `prefers-color-scheme: dark`.

## Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, and danger variants with size options |
| `Badge` | Status indicators with semantic variants (success, error, warning, info) |
| `Card` | Container with optional header, content, footer, and interactive state |
| `Input`, `Textarea`, `Select` | Form inputs with error states |
| `Modal` | Dialog overlay with header, body, footer composition |
| `Dropdown` | Menu trigger with items and keyboard support |
| `Status` | Dot indicator with state labels (active, inactive, error, pending) |
| `Stat` | Value + label display for metrics |
| `Spinner` | Loading indicator in three sizes |
| `Chevron` | Directional icon with rotation states |
| `Empty` | Empty state placeholder with icon, title, description |
| `Clamp` | Text truncation with expand/collapse toggle |
| `Collapsible` | Expandable content sections |
| `Stepper` | Multi-step progress indicator (horizontal/vertical) |

## Project Structure

```
src/
├── components/       # SolidJS components (.tsx)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
├── styles/           # CSS source files
│   ├── tokens.css    # Design tokens (colors, spacing, typography)
│   ├── reset.css     # Modern CSS reset
│   ├── utilities.css # Layout primitives (.stack, .row, .grid)
│   └── components.css# Component-specific styles
└── index.tsx         # Public exports

docs/                 # Astro + Starlight documentation site
scripts/
├── build-css.js      # Concatenates CSS with layer ordering
└── generate-llm-docs.js  # Generates LLM-friendly documentation
```

## Development

```bash
# Install dependencies
bun install

# Build library
bun run build

# Watch mode
bun run dev

# Run documentation site
bun run docs

# Type check
bun run typecheck
```

## Coding Style

- **TypeScript strict mode** - All components are fully typed with exported prop interfaces
- **SolidJS patterns** - Uses `splitProps()` for prop separation, `createSignal()` for local state
- **CSS Layers** - Styles organized into `@layer reset, tokens, components, utilities` for predictable cascade
- **OKLCH colors** - Modern color space with automatic dark mode support
- **Semantic class names** - `.btn`, `.card`, `.modal` etc. with BEM-lite modifiers (`.btn-primary`, `.card-interactive`)

## License

MIT

