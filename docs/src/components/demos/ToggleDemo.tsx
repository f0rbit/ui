import { createSignal } from "solid-js";
import { Toggle } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function ToggleDemo() {
	const [enabled, setEnabled] = createSignal(false);

	return (
		<DemoContainer title="Toggle">
			<div class="demo-section">
				<h4>Basic Toggle</h4>
				<div class="stack stack-sm">
					<Toggle checked={enabled()} onChange={() => setEnabled(!enabled())} />
					<p class="demo-hint">Status: {enabled() ? "On" : "Off"}</p>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Label</h4>
				<div class="stack stack-sm">
					<Toggle label="Dark mode" />
					<Toggle label="Auto-save" checked />
				</div>
			</div>

			<div class="demo-section">
				<h4>With Label + Description</h4>
				<div class="stack stack-sm">
					<Toggle
						label="Push notifications"
						description="Receive alerts when someone mentions you"
					/>
					<Toggle
						label="Two-factor authentication"
						description="Add an extra layer of security to your account"
						checked
					/>
				</div>
			</div>

			<div class="demo-section">
				<h4>Small Size</h4>
				<div class="stack stack-sm">
					<Toggle size="sm" label="Compact toggle" />
					<Toggle size="sm" label="Another small one" checked />
				</div>
			</div>

			<div class="demo-section">
				<h4>Disabled State</h4>
				<div class="stack stack-sm">
					<Toggle label="Disabled off" disabled />
					<Toggle label="Disabled on" disabled checked />
				</div>
			</div>
		</DemoContainer>
	);
}
