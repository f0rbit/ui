import { createSignal } from "solid-js";
import { MultiSelect } from "@f0rbit/ui";
import type { MultiSelectOption } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

const fruits: MultiSelectOption[] = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry" },
	{ value: "date", label: "Date" },
	{ value: "elderberry", label: "Elderberry" },
];

const roles: MultiSelectOption[] = [
	{ value: "admin", label: "Admin", description: "Full system access" },
	{ value: "editor", label: "Editor", description: "Can edit content" },
	{ value: "viewer", label: "Viewer", description: "Read-only access" },
	{ value: "guest", label: "Guest", description: "Limited access", disabled: true },
];

const tags: MultiSelectOption[] = [
	{ value: "urgent", label: "Urgent" },
	{ value: "bug", label: "Bug" },
	{ value: "feature", label: "Feature" },
	{ value: "docs", label: "Documentation" },
	{ value: "help", label: "Help Wanted" },
];

export function MultiSelectDemo() {
	const [selectedFruits, setSelectedFruits] = createSignal<string[]>(["apple"]);
	const [searchableFruits, setSearchableFruits] = createSignal<string[]>([]);
	const [selectedRoles, setSelectedRoles] = createSignal<string[]>([]);
	const [limitedSelection, setLimitedSelection] = createSignal<string[]>([]);
	const [leftLayout, setLeftLayout] = createSignal<string[]>(["apple"]);
	const [belowLayout, setBelowLayout] = createSignal<string[]>(["banana"]);

	return (
		<DemoContainer title="MultiSelect">
			<div class="demo-section">
				<h4>Basic Usage</h4>
				<MultiSelect
					options={fruits}
					value={selectedFruits()}
					onChange={setSelectedFruits}
					placeholder="Select fruits..."
				/>
			</div>

			<div class="demo-section">
				<h4>Searchable</h4>
				<p class="demo-hint">Type to filter options</p>
				<MultiSelect
					options={fruits}
					value={searchableFruits()}
					onChange={setSearchableFruits}
					searchable
					searchPlaceholder="Search fruits..."
					placeholder="Select fruits..."
				/>
			</div>

			<div class="demo-section">
				<h4>With Descriptions</h4>
				<MultiSelect
					options={roles}
					value={selectedRoles()}
					onChange={setSelectedRoles}
					placeholder="Assign roles..."
					addLabel="Assign"
				/>
			</div>

			<div class="demo-section">
				<h4>Max Selection (2)</h4>
				<p class="demo-hint">Limited to 2 items. Button disables when limit reached.</p>
				<MultiSelect
					options={tags}
					value={limitedSelection()}
					onChange={setLimitedSelection}
					max={2}
					placeholder="Select up to 2 tags..."
				/>
			</div>

			<div class="demo-section">
				<h4>Layout Options</h4>
				<div class="stack">
					<div>
						<p class="demo-hint">Right (default)</p>
						<MultiSelect
							options={fruits}
							value={selectedFruits()}
							onChange={setSelectedFruits}
							placeholder="Button on right..."
							layout="right"
						/>
					</div>
					<div>
						<p class="demo-hint">Left</p>
						<MultiSelect
							options={fruits}
							value={leftLayout()}
							onChange={setLeftLayout}
							placeholder="Button on left..."
							layout="left"
						/>
					</div>
					<div>
						<p class="demo-hint">Below</p>
						<MultiSelect
							options={fruits}
							value={belowLayout()}
							onChange={setBelowLayout}
							placeholder="Button below..."
							layout="below"
						/>
					</div>
				</div>
			</div>

			<div class="demo-section">
				<h4>Disabled</h4>
				<MultiSelect
					options={fruits}
					value={["apple", "banana"]}
					onChange={() => {}}
					disabled
					placeholder="Disabled..."
				/>
			</div>
		</DemoContainer>
	);
}
