import { Spinner } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function SpinnerDemo() {
	return (
		<DemoContainer title="Spinner">
			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="cluster">
					<Spinner size="sm" />
					<Spinner size="md" />
					<Spinner size="lg" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Inline with Text</h4>
				<div class="cluster">
					<span class="row">
						<Spinner size="sm" />
						Loading content...
					</span>
				</div>
				<div class="cluster">
					<span class="row">
						Fetching data
						<Spinner size="sm" />
					</span>
				</div>
			</div>
		</DemoContainer>
	);
}
