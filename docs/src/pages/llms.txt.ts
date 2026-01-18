import type { APIRoute } from "astro";
import { components } from "../data/components";

const utilityClasses = [
	{ category: "Layout - Stack (Vertical Flex)", classes: [
		{ name: ".stack", desc: "Vertical flex with medium gap (--space-md)" },
		{ name: ".stack-sm", desc: "Vertical flex with small gap (--space-sm)" },
		{ name: ".stack-lg", desc: "Vertical flex with large gap (--space-lg)" },
	]},
	{ category: "Layout - Row (Horizontal Flex)", classes: [
		{ name: ".row", desc: "Horizontal flex, centered items, small gap" },
		{ name: ".row-sm", desc: "Row with extra small gap" },
		{ name: ".row-lg", desc: "Row with medium gap" },
		{ name: ".row-between", desc: "Row with space-between" },
		{ name: ".row-end", desc: "Row with flex-end alignment" },
		{ name: ".row-start", desc: "Row with flex-start alignment" },
	]},
	{ category: "Layout - Grid", classes: [
		{ name: ".grid", desc: "Auto-fit grid with 250px min column width" },
		{ name: ".grid-2", desc: "Fixed 2-column grid" },
		{ name: ".grid-3", desc: "Fixed 3-column grid" },
		{ name: ".grid-4", desc: "Fixed 4-column grid" },
	]},
	{ category: "Layout - Other", classes: [
		{ name: ".cluster", desc: "Flex wrap with small gap, centered items" },
		{ name: ".center", desc: "Max-width container (65ch) with auto margins" },
		{ name: ".center-narrow", desc: "Narrow center (45ch)" },
		{ name: ".center-wide", desc: "Wide center (90ch)" },
	]},
	{ category: "Typography - Colors", classes: [
		{ name: ".text-primary", desc: "Primary foreground color (--fg)" },
		{ name: ".text-muted", desc: "Muted text color (--fg-muted)" },
		{ name: ".text-subtle", desc: "Subtle text color (--fg-subtle)" },
		{ name: ".text-faint", desc: "Faint text color (--fg-faint)" },
		{ name: ".text-accent", desc: "Accent color (--accent)" },
	]},
	{ category: "Typography - Sizes", classes: [
		{ name: ".text-xs", desc: "Extra small text" },
		{ name: ".text-sm", desc: "Small text" },
		{ name: ".text-base", desc: "Base text size" },
		{ name: ".text-lg", desc: "Large text" },
		{ name: ".text-xl", desc: "Extra large text" },
		{ name: ".text-2xl", desc: "2x large text" },
		{ name: ".text-3xl", desc: "3x large text" },
		{ name: ".text-4xl", desc: "4x large text" },
	]},
	{ category: "Typography - Weight & Style", classes: [
		{ name: ".font-medium", desc: "Medium font weight (500)" },
		{ name: ".font-bold", desc: "Bold font weight (700)" },
		{ name: ".font-mono", desc: "Monospace font family" },
		{ name: ".truncate", desc: "Single-line text with ellipsis overflow" },
	]},
	{ category: "Lists", classes: [
		{ name: ".list", desc: "Styled list with proper spacing and markers" },
	]},
	{ category: "Visibility & Interaction", classes: [
		{ name: ".sr-only", desc: "Screen reader only (visually hidden)" },
		{ name: ".hidden", desc: "Display none" },
		{ name: ".hover-reveal", desc: "Hidden until parent is hovered/focused" },
		{ name: ".interactive", desc: "Border color transition on hover" },
		{ name: ".interactive-color", desc: "Text color transition on hover" },
		{ name: ".hide-mobile", desc: "Hidden on mobile (max-width: 768px)" },
	]},
	{ category: "Animation", classes: [
		{ name: ".animate-spin", desc: "Continuous rotation animation" },
		{ name: ".animate-pulse", desc: "Pulsing opacity animation" },
	]},
];

const commonPatterns = [
	{
		name: "Form with Validation",
		code: `<form class="stack" onSubmit={handleSubmit}>
  <FormField label="Email" error={errors().email} required id="email">
    <Input id="email" type="email" error={!!errors().email} value={email()} onInput={e => setEmail(e.target.value)} />
  </FormField>
  <FormField label="Password" error={errors().password} required id="password">
    <Input id="password" type="password" error={!!errors().password} />
  </FormField>
  <Button type="submit" loading={submitting()}>Submit</Button>
</form>`,
	},
	{
		name: "Confirmation Modal",
		code: `<Modal open={open()} onClose={() => setOpen(false)}>
  <ModalHeader><ModalTitle>Confirm Delete</ModalTitle></ModalHeader>
  <ModalBody>Are you sure you want to delete this item?</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>Delete</Button>
  </ModalFooter>
</Modal>`,
	},
	{
		name: "Card Grid",
		code: `<div class="grid">
  <For each={items()}>
    {item => (
      <Card interactive onClick={() => handleClick(item.id)}>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge variant={item.status}>{item.status}</Badge>
        </CardFooter>
      </Card>
    )}
  </For>
</div>`,
	},
	{
		name: "Loading State",
		code: `<Show when={!loading()} fallback={
  <div class="stack" style="align-items: center; padding: var(--space-lg)">
    <Spinner />
    <span class="text-muted">Loading...</span>
  </div>
}>
  <Content />
</Show>`,
	},
	{
		name: "Empty State with Action",
		code: `<Show when={items().length === 0}>
  <Empty
    icon={<InboxIcon />}
    title="No items yet"
    description="Get started by creating your first item"
  >
    <Button onClick={handleCreate}>Create Item</Button>
  </Empty>
</Show>`,
	},
	{
		name: "Settings Toggle List",
		code: `<Card>
  <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
  <CardContent>
    <div class="stack">
      <Toggle label="Email notifications" description="Receive updates via email" checked={settings().email} onChange={() => toggle('email')} />
      <Toggle label="Push notifications" description="Receive mobile alerts" checked={settings().push} onChange={() => toggle('push')} />
    </div>
  </CardContent>
</Card>`,
	},
];

const accessibilityReference = [
	{ component: "Button", notes: "Use label prop for icon-only buttons; loading announces via aria-busy" },
	{ component: "Modal", notes: "Focus trap enabled; ESC closes; uses role='dialog' and aria-modal" },
	{ component: "Dropdown", notes: "Arrow keys navigate; ESC closes; Enter/Space activates" },
	{ component: "Tabs", notes: "Arrow keys switch tabs; proper ARIA roles (tablist, tab, tabpanel)" },
	{ component: "Checkbox/Toggle", notes: "Always provide label prop; Space to toggle" },
	{ component: "Input/Textarea/Select", notes: "Always wrap in FormField for label association" },
	{ component: "Collapsible", notes: "Uses aria-expanded; Enter/Space to toggle" },
	{ component: "Spinner", notes: "Respects prefers-reduced-motion; add sr-only text for context" },
];

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

		if (component.accessibilityNotes?.length) {
			lines.push("Accessibility:");
			for (const note of component.accessibilityNotes) {
				lines.push(`- ${note}`);
			}
			lines.push("");
		}

		if (component.commonMistakes?.length) {
			lines.push("Avoid:");
			for (const mistake of component.commonMistakes) {
				lines.push(`- ${mistake}`);
			}
			lines.push("");
		}
	}

	lines.push("## Utility Classes");
	lines.push("");
	for (const category of utilityClasses) {
		lines.push(`### ${category.category}`);
		for (const cls of category.classes) {
			lines.push(`- \`${cls.name}\` — ${cls.desc}`);
		}
		lines.push("");
	}

	lines.push("## Common Patterns");
	lines.push("");
	for (const pattern of commonPatterns) {
		lines.push(`### ${pattern.name}`);
		lines.push("```tsx");
		lines.push(pattern.code);
		lines.push("```");
		lines.push("");
	}

	lines.push("## Accessibility Quick Reference");
	lines.push("");
	for (const item of accessibilityReference) {
		lines.push(`- **${item.component}**: ${item.notes}`);
	}
	lines.push("");

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
