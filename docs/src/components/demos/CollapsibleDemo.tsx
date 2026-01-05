import { createSignal } from "solid-js";
import { Collapsible } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function CollapsibleDemo() {
	const [open, setOpen] = createSignal(false);

	return (
		<DemoContainer title="Collapsible">
			<div class="demo-section">
				<h4>Basic (Uncontrolled)</h4>
				<Collapsible trigger="Click to expand">
					<p>This content is hidden by default and can be revealed by clicking the trigger.</p>
				</Collapsible>
			</div>

			<div class="demo-section">
				<h4>Default Open</h4>
				<Collapsible trigger="Already expanded" defaultOpen>
					<p>This content is visible by default because defaultOpen is set to true.</p>
				</Collapsible>
			</div>

			<div class="demo-section">
				<h4>Controlled</h4>
				<div class="demo-row">
					<button onClick={() => setOpen(!open())}>{open() ? "Close" : "Open"} externally</button>
				</div>
				<Collapsible trigger="Controlled collapsible" open={open()} onOpenChange={setOpen}>
					<p>This collapsible is controlled by external state. Use the button above to toggle it.</p>
				</Collapsible>
			</div>
		</DemoContainer>
	);
}
