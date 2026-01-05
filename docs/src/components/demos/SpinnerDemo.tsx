import { Spinner } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function SpinnerDemo() {
	return (
		<DemoContainer title="Spinner">
			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="demo-row">
					<Spinner size="sm" />
					<Spinner size="md" />
					<Spinner size="lg" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Inline with Text</h4>
				<div class="demo-row">
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						<Spinner size="sm" />
						Loading content...
					</span>
				</div>
				<div class="demo-row">
					<span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
						Fetching data
						<Spinner size="sm" />
					</span>
				</div>
			</div>
		</DemoContainer>
	);
}
