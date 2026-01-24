export interface PropMeta {
	name: string;
	type: string;
	default?: string;
	description: string;
}

export interface ExampleMeta {
	title: string;
	code: string;
}

export interface ComponentMeta {
	name: string;
	description: string;
	importStatement: string;
	props: PropMeta[];
	examples: ExampleMeta[];
	accessibilityNotes?: string[];
	compositionPatterns?: string[];
	commonMistakes?: string[];
}

export const components: ComponentMeta[] = [
	{
		name: "Button",
		description: "A clickable button with multiple variants and sizes.",
		importStatement: 'import { Button } from "@f0rbit/ui";',
		props: [
			{ name: "variant", type: '"primary" | "secondary" | "ghost" | "danger"', default: '"primary"', description: "Visual style variant" },
			{ name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Button size" },
			{ name: "icon", type: "boolean", default: "false", description: "Render as square icon-only button" },
			{ name: "label", type: "string", description: "Accessible label for icon buttons (sets aria-label)" },
			{ name: "loading", type: "boolean", default: "false", description: "Show loading spinner" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the button" },
		],
		examples: [
			{ title: "Basic", code: "<Button>Click me</Button>" },
			{ title: "Variants", code: '<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="danger">Danger</Button>' },
			{ title: "Sizes", code: '<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>' },
			{ title: "Loading", code: "<Button loading>Loading...</Button>" },
			{ title: "Icon Button", code: '<Button icon label="Add"><PlusIcon /></Button>\n<Button icon label="Edit" variant="ghost"><EditIcon /></Button>' },
		],
		accessibilityNotes: [
			"Always use the label prop for icon-only buttons (sets aria-label)",
			"Loading state announces to screen readers via aria-busy",
			"Disabled buttons are focusable but not interactive",
		],
		compositionPatterns: [
			"Use with Dropdown: <DropdownTrigger><Button>Menu</Button></DropdownTrigger>",
			"Use in Modal footer: <ModalFooter><Button variant=\"ghost\">Cancel</Button><Button>Confirm</Button></ModalFooter>",
			"Use in Card: <CardFooter><Button>Action</Button></CardFooter>",
		],
		commonMistakes: [
			"Forgetting label prop on icon buttons - screen readers won't announce the purpose",
			"Using loading without disabling form submission - can cause double submits",
			"Using ghost variant for primary actions - use primary for main CTAs",
		],
	},
	{
		name: "Badge",
		description: "A small label for categorization or status indication.",
		importStatement: 'import { Badge } from "@f0rbit/ui";',
		props: [{ name: "variant", type: '"default" | "success" | "error" | "warning" | "info" | "accent"', default: '"default"', description: "Visual style variant" }],
		examples: [
			{ title: "Basic", code: "<Badge>Default</Badge>" },
			{ title: "Variants", code: '<Badge variant="success">Success</Badge>\n<Badge variant="error">Error</Badge>\n<Badge variant="warning">Warning</Badge>\n<Badge variant="info">Info</Badge>\n<Badge variant="accent">Accent</Badge>' },
		],
		accessibilityNotes: [
			"Badge is purely visual - not announced separately by screen readers",
			"Content inside Badge is read as normal text",
		],
		compositionPatterns: [
			"In Card header: <CardTitle>Title <Badge>New</Badge></CardTitle>",
			"With Button: <Button>Updates <Badge variant=\"accent\">3</Badge></Button>",
			"Group badges with cluster: <div class=\"cluster\"><Badge>Tag1</Badge><Badge>Tag2</Badge></div>",
		],
		commonMistakes: [
			"Using Badge for interactive elements - use Button instead",
			"Relying on color alone to convey meaning - always include text",
		],
	},
	{
		name: "Card",
		description: "A container component for grouping related content.",
		importStatement: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@f0rbit/ui";',
		props: [{ name: "interactive", type: "boolean", default: "false", description: "Enable hover effects for clickable cards" }],
		examples: [
			{
				title: "Basic",
				code: "<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card description text</CardDescription>\n  </CardHeader>\n  <CardContent>Main content goes here</CardContent>\n  <CardFooter>Footer content</CardFooter>\n</Card>",
			},
			{ title: "Interactive", code: "<Card interactive>\n  <CardContent>Click me!</CardContent>\n</Card>" },
		],
		accessibilityNotes: [
			"Interactive cards should have role='button' or be wrapped in a link",
			"Use CardTitle for proper heading hierarchy",
		],
		compositionPatterns: [
			"With form: <Card><CardContent><FormField>...</FormField></CardContent><CardFooter><Button>Submit</Button></CardFooter></Card>",
			"With tabs: <Card><Tabs>...</Tabs></Card>",
			"Card grid: <div class=\"grid\"><Card>...</Card><Card>...</Card></div>",
		],
		commonMistakes: [
			"Using interactive without adding click handler or wrapping in link",
			"Nesting interactive cards - avoid nested clickable elements",
			"Missing CardHeader/CardContent structure - use sub-components for consistency",
		],
	},
	{
		name: "Modal",
		description: "A dialog overlay for focused user interactions.",
		importStatement: 'import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@f0rbit/ui";',
		props: [
			{ name: "open", type: "boolean", description: "Controls modal visibility" },
			{ name: "onClose", type: "() => void", description: "Callback when modal is closed" },
		],
		examples: [
			{
				title: "Basic",
				code: "const [open, setOpen] = createSignal(false);\n\n<Button onClick={() => setOpen(true)}>Open Modal</Button>\n<Modal open={open()} onClose={() => setOpen(false)}>\n  <ModalHeader>\n    <ModalTitle>Modal Title</ModalTitle>\n  </ModalHeader>\n  <ModalBody>Modal content</ModalBody>\n  <ModalFooter>\n    <Button onClick={() => setOpen(false)}>Close</Button>\n  </ModalFooter>\n</Modal>",
			},
		],
		accessibilityNotes: [
			"Focus is trapped inside modal when open",
			"ESC key closes the modal",
			"Clicking backdrop closes the modal",
			"Uses aria-modal and role='dialog'",
			"ModalTitle is announced as the dialog label",
		],
		compositionPatterns: [
			"Confirmation dialog: <ModalFooter><Button variant=\"ghost\" onClick={onClose}>Cancel</Button><Button variant=\"danger\" onClick={onConfirm}>Delete</Button></ModalFooter>",
			"Form modal: <ModalBody><form><FormField>...</FormField></form></ModalBody>",
			"With Stepper: <ModalBody><Stepper>...</Stepper></ModalBody> for wizard flows",
		],
		commonMistakes: [
			"Forgetting onClose handler - modal won't close on backdrop click or ESC",
			"Not providing ModalTitle - screen readers need a label for the dialog",
			"Putting autofocus elements without considering keyboard users",
		],
	},
	{
		name: "Dropdown",
		description: "A floating menu triggered by a button or element.",
		importStatement: 'import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider } from "@f0rbit/ui";',
		props: [{ name: "children", type: "JSX.Element", description: "Dropdown content (trigger and menu)" }],
		examples: [
			{
				title: "Basic",
				code: '<Dropdown>\n  <DropdownTrigger>\n    <Button>Open Menu</Button>\n  </DropdownTrigger>\n  <DropdownMenu>\n    <DropdownItem onClick={() => console.log("Item 1")}>Item 1</DropdownItem>\n    <DropdownItem onClick={() => console.log("Item 2")}>Item 2</DropdownItem>\n    <DropdownDivider />\n    <DropdownItem onClick={() => console.log("Item 3")}>Item 3</DropdownItem>\n  </DropdownMenu>\n</Dropdown>',
			},
		],
		accessibilityNotes: [
			"Menu opens on click, closes on outside click or ESC",
			"Arrow keys navigate between items",
			"Enter/Space activates focused item",
		],
		compositionPatterns: [
			"Actions menu: <DropdownItem><EditIcon /> Edit</DropdownItem>",
			"Danger item: Use text-danger class for destructive actions",
			"With Button: <DropdownTrigger><Button icon label=\"More\"><MoreIcon /></Button></DropdownTrigger>",
		],
		commonMistakes: [
			"Putting complex interactive content in DropdownItem - keep items simple",
			"Using for navigation - consider a proper nav component instead",
			"Forgetting DropdownTrigger wrapper around the trigger element",
		],
	},
	{
		name: "Collapsible",
		description: "An expandable/collapsible content section.",
		importStatement: 'import { Collapsible } from "@f0rbit/ui";',
		props: [
			{ name: "trigger", type: "JSX.Element | string", description: "Content shown in the trigger area" },
			{ name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state (uncontrolled)" },
			{ name: "open", type: "boolean", description: "Controlled open state" },
			{ name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes" },
		],
		examples: [
			{ title: "Basic", code: '<Collapsible trigger="Click to expand">\n  <p>This content is collapsible.</p>\n</Collapsible>' },
			{ title: "Default Open", code: '<Collapsible trigger="Already expanded" defaultOpen>\n  <p>This is visible by default.</p>\n</Collapsible>' },
		],
		accessibilityNotes: [
			"Trigger is keyboard accessible (Enter/Space to toggle)",
			"Uses aria-expanded to announce state",
			"Content region is properly associated with trigger",
		],
		compositionPatterns: [
			"FAQ list: <div class=\"stack\">{faqs.map(faq => <Collapsible trigger={faq.q}>{faq.a}</Collapsible>)}</div>",
			"Custom trigger: <Collapsible trigger={<div class=\"row\"><span>Title</span><Chevron /></div>}>...</Collapsible>",
			"Nested: Collapsibles can be nested for hierarchical content",
		],
		commonMistakes: [
			"Using both defaultOpen and open props - pick controlled or uncontrolled",
			"Complex interactive content in trigger - keep trigger simple",
		],
	},
	{
		name: "Stepper",
		description: "A multi-step progress indicator.",
		importStatement: 'import { Stepper, Step } from "@f0rbit/ui";',
		props: [{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of steps" }],
		examples: [
			{
				title: "Basic",
				code: '<Stepper>\n  <Step title="Step 1" description="First step" status="completed" />\n  <Step title="Step 2" description="Second step" status="current" />\n  <Step title="Step 3" description="Third step" status="upcoming" />\n</Stepper>',
			},
			{ title: "Vertical", code: '<Stepper orientation="vertical">\n  <Step title="Step 1" status="completed" />\n  <Step title="Step 2" status="current" />\n  <Step title="Step 3" status="upcoming" />\n</Stepper>' },
		],
		accessibilityNotes: [
			"Steps announce their status via aria-current for current step",
			"Completed steps show checkmark for visual confirmation",
		],
		compositionPatterns: [
			"Wizard in Modal: <ModalBody><Stepper>...</Stepper><div>{stepContent()}</div></ModalBody>",
			"Checkout flow: Map step index to status based on current step",
		],
		commonMistakes: [
			"Making Step indicators clickable without implementing navigation",
			"Not updating status props when step changes",
		],
	},
	{
		name: "Step",
		description: "Individual step within a Stepper component.",
		importStatement: 'import { Step } from "@f0rbit/ui";',
		props: [
			{ name: "title", type: "string", description: "Step title text" },
			{ name: "description", type: "string", description: "Optional description below the title" },
			{ name: "icon", type: "JSX.Element", description: "Custom icon for the step indicator" },
			{ name: "status", type: '"completed" | "current" | "upcoming"', default: '"upcoming"', description: "Current status of the step" },
		],
		examples: [
			{ title: "Completed", code: '<Step title="Done" status="completed" />' },
			{ title: "Current", code: '<Step title="In Progress" status="current" />' },
		],
	},
	{
		name: "Input",
		description: "A text input field for single-line user input.",
		importStatement: 'import { Input } from "@f0rbit/ui";',
		props: [
			{ name: "error", type: "boolean", default: "false", description: "Show error styling" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the input" },
			{ name: "placeholder", type: "string", description: "Placeholder text" },
		],
		examples: [
			{ title: "Basic", code: '<Input placeholder="Enter text..." />' },
			{ title: "Error State", code: '<Input error placeholder="Invalid input" />' },
			{ title: "Disabled", code: '<Input disabled value="Disabled input" />' },
		],
		accessibilityNotes: [
			"Always pair with FormField for proper label association",
			"Error state is visual only - use FormField error prop for error message",
			"Use aria-describedby for additional context if not using FormField",
		],
		compositionPatterns: [
			"With FormField: <FormField label=\"Email\" id=\"email\"><Input id=\"email\" type=\"email\" /></FormField>",
			"With icon: Wrap in div.row and add icon before/after Input",
		],
		commonMistakes: [
			"Using Input without FormField - missing accessible label",
			"Setting error={true} without showing error message",
			"Forgetting to match id prop with FormField id",
		],
	},
	{
		name: "Textarea",
		description: "A multi-line text input field.",
		importStatement: 'import { Textarea } from "@f0rbit/ui";',
		props: [
			{ name: "error", type: "boolean", default: "false", description: "Show error styling" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the textarea" },
			{ name: "placeholder", type: "string", description: "Placeholder text" },
		],
		examples: [
			{ title: "Basic", code: '<Textarea placeholder="Enter multiple lines..." />' },
			{ title: "Error State", code: '<Textarea error placeholder="Invalid content" />' },
		],
		accessibilityNotes: [
			"Always pair with FormField for proper label association",
			"Same accessibility considerations as Input",
		],
		compositionPatterns: [
			"With FormField: <FormField label=\"Description\"><Textarea rows={4} /></FormField>",
		],
		commonMistakes: [
			"Using Textarea without FormField - missing accessible label",
		],
	},
	{
		name: "Select",
		description: "A dropdown select input for choosing from options.",
		importStatement: 'import { Select } from "@f0rbit/ui";',
		props: [
			{ name: "error", type: "boolean", default: "false", description: "Show error styling" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the select" },
		],
		examples: [
			{ title: "Basic", code: '<Select>\n  <option value="">Select an option</option>\n  <option value="1">Option 1</option>\n  <option value="2">Option 2</option>\n  <option value="3">Option 3</option>\n</Select>' },
			{ title: "Error State", code: '<Select error>\n  <option value="">Select required</option>\n</Select>' },
		],
		accessibilityNotes: [
			"Uses native select element - fully accessible by default",
			"Pair with FormField for label association",
		],
		compositionPatterns: [
			"With FormField: <FormField label=\"Country\" required><Select>...</Select></FormField>",
		],
		commonMistakes: [
			"Using Select without FormField - missing accessible label",
			"Forgetting empty first option for placeholder",
		],
	},
	{
		name: "Status",
		description: "A status indicator with colored dot and label.",
		importStatement: 'import { Status } from "@f0rbit/ui";',
		props: [
			{ name: "state", type: '"active" | "inactive" | "error" | "pending"', description: "Status state determining color and default label" },
			{ name: "label", type: "string", description: "Custom label text (overrides default)" },
		],
		examples: [
			{ title: "States", code: '<Status state="active" />\n<Status state="inactive" />\n<Status state="error" />\n<Status state="pending" />' },
			{ title: "Custom Label", code: '<Status state="active" label="Online" />' },
		],
		accessibilityNotes: [
			"Status label is always shown (not just color)",
			"Color is supplementary, not sole indicator",
		],
		compositionPatterns: [
			"In table row: <td><Status state={row.status} /></td>",
			"In Card header: <CardHeader><div class=\"row-between\"><CardTitle>Server</CardTitle><Status state=\"active\" /></div></CardHeader>",
		],
		commonMistakes: [
			"Relying on color alone - always provide meaningful label",
		],
	},
	{
		name: "Stat",
		description: "A display component for statistics with value and label.",
		importStatement: 'import { Stat } from "@f0rbit/ui";',
		props: [
			{ name: "value", type: "string | number", description: "The statistic value to display" },
			{ name: "label", type: "string", description: "Label describing the statistic" },
		],
		examples: [
			{ title: "Basic", code: '<Stat value={42} label="Total Users" />' },
			{ title: "String Value", code: '<Stat value="99.9%" label="Uptime" />' },
		],
		accessibilityNotes: [
			"Label and value are properly associated for screen readers",
		],
		compositionPatterns: [
			"Stats grid: <div class=\"grid-3\">{stats.map(s => <Stat value={s.value} label={s.label} />)}</div>",
			"In Card: <Card><CardContent><div class=\"grid-3\"><Stat /><Stat /><Stat /></div></CardContent></Card>",
		],
		commonMistakes: [
			"Using for interactive data - Stat is display only",
		],
	},
	{
		name: "Spinner",
		description: "A loading indicator animation.",
		importStatement: 'import { Spinner } from "@f0rbit/ui";',
		props: [{ name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the spinner" }],
		examples: [{ title: "Sizes", code: '<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />' }],
		accessibilityNotes: [
			"Respects prefers-reduced-motion (animation disabled)",
			"Add aria-label or sr-only text for screen readers when used standalone",
		],
		compositionPatterns: [
			"In Button: <Button loading> uses Spinner internally",
			"Loading state: <Show when={loading()} fallback={<Content />}><Spinner /></Show>",
			"Centered loading: <div class=\"stack\" style=\"align-items: center\"><Spinner /><span class=\"text-muted\">Loading...</span></div>",
		],
		commonMistakes: [
			"Using without accessible label - add sr-only text nearby",
		],
	},
	{
		name: "Empty",
		description: "A placeholder for empty states with optional icon and message.",
		importStatement: 'import { Empty } from "@f0rbit/ui";',
		props: [
			{ name: "icon", type: "JSX.Element", description: "Icon to display above the message" },
			{ name: "title", type: "string", description: "Main title text" },
			{ name: "description", type: "string", description: "Additional description text" },
			{ name: "children", type: "JSX.Element", description: "Additional content (e.g., action buttons)" },
		],
		examples: [
			{ title: "Basic", code: '<Empty\n  title="No items found"\n  description="Try adjusting your filters"\n/>' },
			{ title: "With Action", code: '<Empty title="No data" description="Get started by adding an item">\n  <Button>Add Item</Button>\n</Empty>' },
		],
		accessibilityNotes: [
			"Title is a heading (h3) for proper document structure",
			"Action buttons remain fully accessible",
		],
		compositionPatterns: [
			"List empty state: <Show when={items.length === 0}><Empty title=\"No items\" /></Show>",
			"Search empty: <Empty icon={<SearchIcon />} title=\"No results\" description={`No results for \"${query}\"`} />",
		],
		commonMistakes: [
			"Using Empty for error states - consider a dedicated error component",
		],
	},
	{
		name: "Clamp",
		description: "A text clamping component with expand/collapse functionality.",
		importStatement: 'import { Clamp } from "@f0rbit/ui";',
		props: [
			{ name: "lines", type: "number", default: "3", description: "Maximum number of lines before clamping" },
			{ name: "showMoreText", type: "string", default: '"show more"', description: "Text for expand button" },
			{ name: "showLessText", type: "string", default: '"show less"', description: "Text for collapse button" },
		],
		examples: [
			{
				title: "Basic",
				code: "<Clamp lines={2}>\n  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n  Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>\n</Clamp>",
			},
		],
		accessibilityNotes: [
			"Expand/collapse button is keyboard accessible",
			"Full content is accessible when expanded",
		],
		compositionPatterns: [
			"Description preview: <Clamp lines={3}>{longDescription}</Clamp>",
		],
		commonMistakes: [
			"Using with very short content - button shows when not needed",
			"Using lines={1} - consider truncate utility class instead",
		],
	},
	{
		name: "Chevron",
		description: "An animated chevron icon for expand/collapse indicators.",
		importStatement: 'import { Chevron } from "@f0rbit/ui";',
		props: [
			{ name: "expanded", type: "boolean", default: "false", description: "Whether the chevron is in expanded state" },
			{ name: "facing", type: '"right" | "down"', default: '"right"', description: "Default direction the chevron points" },
			{ name: "size", type: "number | string", default: '"1em"', description: "Size of the chevron" },
		],
		examples: [
			{ title: "Basic", code: "<Chevron />\n<Chevron expanded />" },
			{ title: "Facing Down", code: '<Chevron facing="down" />\n<Chevron facing="down" expanded />' },
		],
		accessibilityNotes: [
			"Decorative - use with proper ARIA on parent element",
			"Rotation animation respects prefers-reduced-motion",
		],
		compositionPatterns: [
			"Custom Collapsible trigger: <div class=\"row\"><span>Section</span><Chevron expanded={isOpen()} /></div>",
			"Tree view: <button onClick={toggle}><Chevron expanded={expanded()} /> {name}</button>",
		],
		commonMistakes: [
			"Using as standalone button - wrap in button with aria-expanded",
		],
	},
	{
		name: "Tabs",
		description: "A tabbed interface for organizing content into separate views.",
		importStatement: 'import { Tabs, TabList, Tab, TabPanel } from "@f0rbit/ui";',
		props: [
			{ name: "defaultValue", type: "string", description: "Initial active tab (uncontrolled)" },
			{ name: "value", type: "string", description: "Controlled active tab value" },
			{ name: "onValueChange", type: "(value: string) => void", description: "Callback when active tab changes" },
		],
		examples: [
			{
				title: "Basic",
				code: '<Tabs defaultValue="tab1">\n  <TabList>\n    <Tab value="tab1">Tab 1</Tab>\n    <Tab value="tab2">Tab 2</Tab>\n  </TabList>\n  <TabPanel value="tab1">Content 1</TabPanel>\n  <TabPanel value="tab2">Content 2</TabPanel>\n</Tabs>',
			},
		],
		accessibilityNotes: [
			"Arrow keys navigate between tabs",
			"Tab/Shift+Tab moves focus in/out of tab list",
			"Uses proper ARIA roles (tablist, tab, tabpanel)",
			"Active tab indicated via aria-selected",
		],
		compositionPatterns: [
			"In Card: <Card><CardContent><Tabs>...</Tabs></CardContent></Card>",
			"With icons: <Tab value=\"settings\"><SettingsIcon /> Settings</Tab>",
		],
		commonMistakes: [
			"Mismatched Tab value and TabPanel value - content won't show",
			"Using both defaultValue and value - pick controlled or uncontrolled",
			"Putting TabPanel outside of Tabs - context won't work",
		],
	},
	
	{
		name: "Checkbox",
		description: "A checkbox input for boolean or indeterminate selections.",
		importStatement: 'import { Checkbox } from "@f0rbit/ui";',
		props: [
			{ name: "checked", type: "boolean", default: "false", description: "Whether the checkbox is checked" },
			{ name: "indeterminate", type: "boolean", default: "false", description: "Show indeterminate state (partial selection)" },
			{ name: "label", type: "string", description: "Label text displayed next to the checkbox" },
			{ name: "description", type: "string", description: "Description text below the label" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the checkbox" },
			{ name: "onChange", type: "() => void", description: "Callback when checkbox is toggled" },
		],
		examples: [
			{ title: "Basic", code: "<Checkbox />" },
			{ title: "With Label", code: '<Checkbox label="Accept terms and conditions" />' },
			{ title: "With Description", code: '<Checkbox label="Email notifications" description="Receive email updates about your account" />' },
		],
		accessibilityNotes: [
			"Label prop creates proper label association automatically",
			"Keyboard accessible - Space to toggle",
			"Indeterminate state announced by screen readers",
		],
		compositionPatterns: [
			"Checkbox group: <div class=\"stack-sm\">{options.map(o => <Checkbox label={o.label} checked={selected.has(o.id)} />)}</div>",
			"Select all: <Checkbox indeterminate={someSelected && !allSelected} checked={allSelected} label=\"Select all\" />",
		],
		commonMistakes: [
			"Using Checkbox without label prop - accessibility issue",
			"Forgetting onChange handler for controlled checkboxes",
		],
	},
	{
		name: "Toggle",
		description: "A switch component for toggling between on/off states.",
		importStatement: 'import { Toggle } from "@f0rbit/ui";',
		props: [
			{ name: "checked", type: "boolean", default: "false", description: "Whether the toggle is on" },
			{ name: "label", type: "string", description: "Label text displayed next to the toggle" },
			{ name: "description", type: "string", description: "Description text below the label" },
			{ name: "size", type: '"sm" | "md"', default: '"md"', description: "Toggle size" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the toggle" },
			{ name: "onChange", type: "() => void", description: "Callback when toggle is switched" },
		],
		examples: [
			{ title: "Basic", code: "<Toggle />" },
			{ title: "With Label", code: '<Toggle label="Dark mode" />' },
			{ title: "With Description", code: '<Toggle label="Push notifications" description="Receive alerts when someone mentions you" />' },
		],
		accessibilityNotes: [
			"Uses role='switch' for proper screen reader announcement",
			"Space/Enter to toggle",
			"Label prop creates proper association",
		],
		compositionPatterns: [
			"Settings page: <Card><CardContent><div class=\"stack\">{settings.map(s => <Toggle label={s.name} description={s.desc} />)}</div></CardContent></Card>",
		],
		commonMistakes: [
			"Using Toggle without label - accessibility issue",
			"Using Toggle for multi-option selection - use Checkbox or radio instead",
		],
	},
	{
		name: "FormField",
		description: "A wrapper component for form inputs with label, description, and error states.",
		importStatement: 'import { FormField } from "@f0rbit/ui";',
		props: [
			{ name: "label", type: "string", description: "Label text for the field" },
			{ name: "description", type: "string", description: "Helper text below the input" },
			{ name: "error", type: "string", description: "Error message to display" },
			{ name: "required", type: "boolean", default: "false", description: "Show required indicator" },
			{ name: "id", type: "string", description: "ID to associate label with input" },
		],
		examples: [
			{ title: "Basic", code: '<FormField label="Username" id="username">\n  <Input id="username" placeholder="Enter username" />\n</FormField>' },
			{ title: "With Error", code: '<FormField label="Email" error="Invalid email address" id="email">\n  <Input id="email" error />\n</FormField>' },
		],
		accessibilityNotes: [
			"Automatically associates label with input via htmlFor/id",
			"Error messages are linked via aria-describedby",
			"Required indicator shown visually and via aria-required",
		],
		compositionPatterns: [
			"Form layout: <form class=\"stack\"><FormField>...</FormField><FormField>...</FormField><Button type=\"submit\">Submit</Button></form>",
			"With any input type: Works with Input, Textarea, Select",
		],
		commonMistakes: [
			"Mismatched id between FormField and Input - label won't associate",
			"Setting error on FormField but forgetting error prop on Input - visual mismatch",
		],
	},
	{
		name: "Timeline",
		description: "A vertical timeline for displaying chronological events.",
		importStatement: 'import { Timeline, type TimelineItem } from "@f0rbit/ui";',
		props: [
			{ name: "items", type: "TimelineItem[]", description: "Array of timeline items to display" },
		],
		examples: [
			{ title: "Basic", code: '<Timeline items={[\n  { id: 1, title: "Order placed", timestamp: "10:30 AM" },\n  { id: 2, title: "Processing", timestamp: "10:45 AM" },\n  { id: 3, title: "Shipped", timestamp: "2:15 PM" },\n]} />' },
		],
		accessibilityNotes: [
			"Uses list semantics for proper screen reader navigation",
			"Timestamps are properly associated with events",
		],
		compositionPatterns: [
			"Activity log: <Timeline items={activities.map(a => ({ id: a.id, title: a.action, timestamp: formatDate(a.time), description: a.details }))} />",
			"With custom icons: TimelineItem supports icon property",
		],
		commonMistakes: [
			"Large datasets without virtualization - consider pagination",
		],
	},
	{
		name: "TabList",
		description: "Container for Tab components within Tabs.",
		importStatement: 'import { TabList } from "@f0rbit/ui";',
		props: [{ name: "children", type: "JSX.Element", description: "Tab components" }],
		examples: [],
	},
	{
		name: "Tab",
		description: "Individual tab button within TabList.",
		importStatement: 'import { Tab } from "@f0rbit/ui";',
		props: [
			{ name: "value", type: "string", description: "Unique identifier for this tab" },
			{ name: "children", type: "JSX.Element", description: "Tab label content" },
		],
		examples: [],
	},
	{
		name: "TabPanel",
		description: "Content panel shown when its corresponding tab is active.",
		importStatement: 'import { TabPanel } from "@f0rbit/ui";',
		props: [
			{ name: "value", type: "string", description: "Must match a Tab value to associate content" },
			{ name: "children", type: "JSX.Element", description: "Panel content" },
		],
		examples: [],
	},
	{
		name: "ChipInput",
		description: "An input field for managing a collection of string values displayed as removable chips.",
		importStatement: 'import { ChipInput } from "@f0rbit/ui";',
		props: [
			{ name: "value", type: "string[]", description: "Array of chip values" },
			{ name: "onChange", type: "(value: string[]) => void", description: "Callback when chips change" },
			{ name: "transform", type: "(input: string) => string", description: "Transform input before adding (e.g., lowercase)" },
			{ name: "validate", type: "(input: string, current: string[]) => boolean", description: "Validate input before adding" },
			{ name: "allowDuplicates", type: "boolean", default: "false", description: "Allow duplicate chip values" },
			{ name: "addKeys", type: "string[]", default: '["Enter"]', description: "Keys that trigger adding a chip" },
			{ name: "placeholder", type: "string", description: "Placeholder text for the input" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the input" },
			{ name: "error", type: "boolean", default: "false", description: "Show error styling" },
		],
		examples: [
			{ title: "Basic", code: '<ChipInput value={tags()} onChange={setTags} placeholder="Add tag..." />' },
			{ title: "With Transform", code: '<ChipInput value={tags()} onChange={setTags} transform={(s) => s.toLowerCase()} />' },
			{ title: "Email Validation", code: '<ChipInput value={emails()} onChange={setEmails} validate={(email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)} />' },
		],
		accessibilityNotes: [
			"Each chip has an accessible remove button with aria-label",
			"Input is keyboard navigable - Enter to add chips",
			"Use with FormField for proper label association",
		],
		compositionPatterns: [
			"With FormField: <FormField label=\"Tags\"><ChipInput value={tags()} onChange={setTags} /></FormField>",
			"Email list: <ChipInput validate={(e) => isValidEmail(e)} placeholder=\"Add email...\" />",
			"Comma-separated: <ChipInput addKeys={[\"Enter\", \",\"]} />",
		],
		commonMistakes: [
			"Forgetting to handle onChange - chips won't update",
			"Using without FormField - missing accessible label",
			"Setting error={true} without visual feedback to user about what's wrong",
		],
	},
	{
		name: "Tree",
		description: "A hierarchical tree view for nested data structures with expand/collapse.",
		importStatement: 'import { Tree, buildTree, type TreeNode, type FlatTreeItem } from "@f0rbit/ui";',
		props: [
			{ name: "nodes", type: "TreeNode[] | TreeNode", description: "Tree node(s) to render" },
			{ name: "renderNode", type: "(node: TreeNode, depth: number) => JSX.Element", description: "Custom node label rendering" },
			{ name: "renderActions", type: "(node: TreeNode, depth: number) => JSX.Element", description: "Render action buttons for each node" },
			{ name: "showGuides", type: "boolean", default: "true", description: "Show tree guide lines" },
			{ name: "defaultExpanded", type: "boolean | string[]", default: "true", description: "Initial expansion state (uncontrolled)" },
			{ name: "expanded", type: "string[]", description: "Controlled expansion state (node IDs)" },
			{ name: "onExpandedChange", type: "(expanded: string[]) => void", description: "Callback when expansion changes" },
			{ name: "emptyMessage", type: "string", default: '"No items"', description: "Message when tree is empty" },
		],
		examples: [
			{ title: "Basic", code: '<Tree nodes={fileTree} />' },
			{ title: "From Flat Data", code: 'const tree = buildTree(flatItems);\n<Tree nodes={tree} />' },
			{ title: "With Actions", code: '<Tree nodes={nodes} renderActions={(node) => <Button size="sm">Select</Button>} />' },
		],
		accessibilityNotes: [
			"Uses proper ARIA tree roles (tree, treeitem)",
			"Expand/collapse buttons have aria-label",
			"aria-expanded indicates node state",
			"Keyboard navigation supported",
		],
		compositionPatterns: [
			"File browser: <Tree nodes={files} renderNode={(n) => <><FileIcon /> {n.label}</>} />",
			"With actions: <Tree renderActions={(node) => <Dropdown>...</Dropdown>} />",
			"Controlled: <Tree expanded={expanded()} onExpandedChange={setExpanded} />",
		],
		commonMistakes: [
			"Using both defaultExpanded and expanded - pick controlled or uncontrolled",
			"Forgetting unique IDs for nodes - expansion won't work correctly",
			"Deep nesting without guides - use showGuides={true} for clarity",
		],
	},
	{
		name: "MultiSelect",
		description: "A dropdown for selecting multiple items from a list with searchable dropdown.",
		importStatement: 'import { MultiSelect, type MultiSelectOption } from "@f0rbit/ui";',
		props: [
			{ name: "options", type: "MultiSelectOption[]", description: "Available options to select from" },
			{ name: "value", type: "T[]", description: "Array of selected values" },
			{ name: "onChange", type: "(value: T[]) => void", description: "Callback when selection changes" },
			{ name: "placeholder", type: "string", default: '"Nothing selected"', description: "Placeholder when empty" },
			{ name: "addLabel", type: "string", default: '"Add"', description: "Label for the add button" },
			{ name: "doneLabel", type: "string", default: '"Done"', description: "Label for the done button" },
			{ name: "emptyMessage", type: "string", default: '"No options available"', description: "Message when no options match" },
			{ name: "searchable", type: "boolean", default: "false", description: "Enable search filtering" },
			{ name: "searchPlaceholder", type: "string", default: '"Search..."', description: "Search input placeholder" },
			{ name: "max", type: "number", description: "Maximum number of selections" },
			{ name: "disabled", type: "boolean", default: "false", description: "Disable the select" },
			{ name: "renderBadge", type: "(option: MultiSelectOption) => JSX.Element", description: "Custom badge rendering" },
			{ name: "renderOption", type: "(option: MultiSelectOption) => JSX.Element", description: "Custom option rendering" },
		],
		examples: [
			{ title: "Basic", code: '<MultiSelect options={options} value={selected()} onChange={setSelected} />' },
			{ title: "Searchable", code: '<MultiSelect options={options} value={selected()} onChange={setSelected} searchable />' },
			{ title: "With Max", code: '<MultiSelect options={options} value={selected()} onChange={setSelected} max={3} />' },
		],
		accessibilityNotes: [
			"Uses listbox role with aria-multiselectable",
			"Keyboard navigation with arrow keys",
			"Escape closes dropdown",
			"Selected items have accessible remove buttons",
		],
		compositionPatterns: [
			"Tag assignment: <MultiSelect options={tags} searchable placeholder=\"Add tags...\" />",
			"Role picker: <MultiSelect options={roles} max={3} addLabel=\"Assign\" />",
			"Custom badges: <MultiSelect renderBadge={(opt) => <Badge variant=\"accent\">{opt.label}</Badge>} />",
		],
		commonMistakes: [
			"Forgetting onChange handler - selections won't persist",
			"Not providing unique values in options - selection tracking breaks",
			"Using max without communicating limit to user",
		],
	},
];

export const componentsByName = new Map(components.map(c => [c.name, c]));

export const getComponent = (name: string): ComponentMeta | undefined => componentsByName.get(name);
