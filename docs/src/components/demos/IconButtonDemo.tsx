import { IconButton } from "@f0rbit/ui";
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

export function IconButtonDemo() {
	return (
		<DemoContainer title="IconButton">
			<div class="demo-section">
				<h4>Variants</h4>
				<div class="cluster">
					<IconButton label="Add item"><PlusIcon /></IconButton>
					<IconButton label="Edit" variant="secondary"><EditIcon /></IconButton>
					<IconButton label="Settings" variant="ghost"><SettingsIcon /></IconButton>
					<IconButton label="Delete" variant="danger"><TrashIcon /></IconButton>
				</div>
			</div>

			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="cluster">
					<IconButton label="Small" size="sm"><PlusIcon /></IconButton>
					<IconButton label="Medium" size="md"><PlusIcon /></IconButton>
					<IconButton label="Large" size="lg"><PlusIcon /></IconButton>
				</div>
			</div>

			<div class="demo-section">
				<h4>States</h4>
				<div class="cluster">
					<IconButton label="Loading" loading><PlusIcon /></IconButton>
					<IconButton label="Disabled" disabled><PlusIcon /></IconButton>
				</div>
			</div>

			<div class="demo-section">
				<h4>Combined</h4>
				<div class="cluster">
					<IconButton label="Edit" variant="ghost" size="sm"><EditIcon /></IconButton>
					<IconButton label="Delete" variant="danger" size="lg"><TrashIcon /></IconButton>
					<IconButton label="Settings" variant="secondary" size="sm"><SettingsIcon /></IconButton>
				</div>
			</div>
		</DemoContainer>
	);
}
