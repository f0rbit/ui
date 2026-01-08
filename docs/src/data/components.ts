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
	},
	{
		name: "Spinner",
		description: "A loading indicator animation.",
		importStatement: 'import { Spinner } from "@f0rbit/ui";',
		props: [{ name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the spinner" }],
		examples: [{ title: "Sizes", code: '<Spinner size="sm" />\n<Spinner size="md" />\n<Spinner size="lg" />' }],
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
];

export const componentsByName = new Map(components.map(c => [c.name, c]));

export const getComponent = (name: string): ComponentMeta | undefined => componentsByName.get(name);
