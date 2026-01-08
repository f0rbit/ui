import { createSignal } from "solid-js";
import { Checkbox } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function CheckboxDemo() {
	const [checked, setChecked] = createSignal(false);
	const [items, setItems] = createSignal([true, false, true]);

	const allChecked = () => items().every(Boolean);
	const someChecked = () => items().some(Boolean) && !allChecked();

	const toggleAll = () => {
		const newValue = !allChecked();
		setItems([newValue, newValue, newValue]);
	};

	const toggleItem = (index: number) => {
		const newItems = [...items()];
		newItems[index] = !newItems[index];
		setItems(newItems);
	};

	return (
		<DemoContainer title="Checkbox">
			<div class="demo-section">
				<h4>Basic Checkbox</h4>
				<div class="stack stack-sm">
					<Checkbox checked={checked()} onChange={() => setChecked(!checked())} />
				</div>
			</div>

			<div class="demo-section">
				<h4>With Label</h4>
				<div class="stack stack-sm">
					<Checkbox label="Accept terms and conditions" />
					<Checkbox label="Subscribe to newsletter" />
				</div>
			</div>

			<div class="demo-section">
				<h4>With Label + Description</h4>
				<div class="stack stack-sm">
					<Checkbox
						label="Email notifications"
						description="Receive email updates about your account activity"
					/>
					<Checkbox
						label="Marketing emails"
						description="Get news about new features and special offers"
					/>
				</div>
			</div>

			<div class="demo-section">
				<h4>Indeterminate State</h4>
				<div class="stack stack-sm">
					<Checkbox
						label="Select all"
						checked={allChecked()}
						indeterminate={someChecked()}
						onChange={toggleAll}
					/>
					<div style="padding-left: 1.5rem">
						<div class="stack stack-sm">
							<Checkbox
								label="Item 1"
								checked={items()[0]}
								onChange={() => toggleItem(0)}
							/>
							<Checkbox
								label="Item 2"
								checked={items()[1]}
								onChange={() => toggleItem(1)}
							/>
							<Checkbox
								label="Item 3"
								checked={items()[2]}
								onChange={() => toggleItem(2)}
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="demo-section">
				<h4>Disabled State</h4>
				<div class="stack stack-sm">
					<Checkbox label="Disabled unchecked" disabled />
					<Checkbox label="Disabled checked" disabled checked />
				</div>
			</div>
		</DemoContainer>
	);
}
