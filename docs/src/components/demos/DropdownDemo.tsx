import { createSignal } from "solid-js";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownDivider, Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function DropdownDemo() {
	const [selected, setSelected] = createSignal("None");

	return (
		<DemoContainer title="Dropdown">
			<div class="demo-section">
				<h4>Basic Dropdown</h4>
				<div class="demo-row">
					<Dropdown>
						<DropdownTrigger>
							<Button>Open Menu</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem onClick={() => console.log("Edit clicked")}>Edit</DropdownItem>
							<DropdownItem onClick={() => console.log("Duplicate clicked")}>Duplicate</DropdownItem>
							<DropdownDivider />
							<DropdownItem onClick={() => console.log("Delete clicked")}>Delete</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Active Item</h4>
				<p class="demo-hint">Selected: {selected()}</p>
				<div class="demo-row">
					<Dropdown>
						<DropdownTrigger>
							<Button variant="secondary">Select Option</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem active={selected() === "Option 1"} onClick={() => setSelected("Option 1")}>
								Option 1
							</DropdownItem>
							<DropdownItem active={selected() === "Option 2"} onClick={() => setSelected("Option 2")}>
								Option 2
							</DropdownItem>
							<DropdownItem active={selected() === "Option 3"} onClick={() => setSelected("Option 3")}>
								Option 3
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Icons</h4>
				<div class="demo-row">
					<Dropdown>
						<DropdownTrigger>
							<Button>Actions</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem>
								<span>📝</span> Edit
							</DropdownItem>
							<DropdownItem>
								<span>📋</span> Copy
							</DropdownItem>
							<DropdownItem>
								<span>📁</span> Move
							</DropdownItem>
							<DropdownDivider />
							<DropdownItem>
								<span>🗑️</span> Delete
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
		</DemoContainer>
	);
}
