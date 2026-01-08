import { Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

const PlusIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M8 3v10M3 8h10" />
	</svg>
);

const EditIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" />
	</svg>
);

const TrashIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1m2 0v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4h8z" />
	</svg>
);

const SettingsIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
		<circle cx="8" cy="8" r="2" />
		<path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
	</svg>
);

export function ButtonDemo() {
	return (
		<DemoContainer title="Button">
			<div class="demo-section">
				<h4>Variants</h4>
				<div class="cluster">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger">Danger</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="cluster">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>States</h4>
				<div class="cluster">
					<Button loading>Loading</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Icon Button Variants</h4>
				<div class="cluster">
					<Button icon label="Add item"><PlusIcon /></Button>
					<Button icon label="Edit" variant="secondary"><EditIcon /></Button>
					<Button icon label="Settings" variant="ghost"><SettingsIcon /></Button>
					<Button icon label="Delete" variant="danger"><TrashIcon /></Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Icon Button Sizes</h4>
				<div class="cluster">
					<Button icon label="Small" size="sm"><PlusIcon /></Button>
					<Button icon label="Medium" size="md"><PlusIcon /></Button>
					<Button icon label="Large" size="lg"><PlusIcon /></Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Icon Button States</h4>
				<div class="cluster">
					<Button icon label="Loading" loading><PlusIcon /></Button>
					<Button icon label="Disabled" disabled><PlusIcon /></Button>
				</div>
			</div>
		</DemoContainer>
	);
}
