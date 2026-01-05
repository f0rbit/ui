import { createSignal } from "solid-js";
import { Chevron, Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function ChevronDemo() {
	const [expanded1, setExpanded1] = createSignal(false);
	const [expanded2, setExpanded2] = createSignal(false);

	return (
		<DemoContainer title="Chevron">
			<div class="demo-section">
				<h4>Default (Right-facing)</h4>
				<div class="demo-row">
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						<Chevron />
						Collapsed
					</span>
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						<Chevron expanded />
						Expanded
					</span>
				</div>
			</div>

			<div class="demo-section">
				<h4>Down-facing Variant</h4>
				<div class="demo-row">
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						<Chevron facing="down" />
						Collapsed
					</span>
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						<Chevron facing="down" expanded />
						Expanded
					</span>
				</div>
			</div>

			<div class="demo-section">
				<h4>Interactive Toggle</h4>
				<div class="demo-row">
					<Button variant="ghost" onClick={() => setExpanded1(e => !e)}>
						<Chevron expanded={expanded1()} />
						<span style={{ "margin-left": "0.5rem" }}>Click to toggle</span>
					</Button>
				</div>
				<div class="demo-row">
					<Button variant="ghost" onClick={() => setExpanded2(e => !e)}>
						<span style={{ "margin-right": "0.5rem" }}>Accordion header</span>
						<Chevron facing="down" expanded={expanded2()} />
					</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="demo-row">
					<Chevron size="0.75em" />
					<Chevron size="1em" />
					<Chevron size="1.5em" />
					<Chevron size="2em" />
				</div>
			</div>
		</DemoContainer>
	);
}
