import { Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function ButtonDemo() {
	return (
		<DemoContainer title="Button">
			<div class="demo-section">
				<h4>Variants</h4>
				<div class="demo-row">
					<Button>Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="danger">Danger</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Sizes</h4>
				<div class="demo-row">
					<Button size="sm">Small</Button>
					<Button size="md">Medium</Button>
					<Button size="lg">Large</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>States</h4>
				<div class="demo-row">
					<Button loading>Loading</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>

			<div class="demo-section">
				<h4>Icon Button</h4>
				<div class="demo-row">
					<Button icon size="sm">
						+
					</Button>
					<Button icon size="md">
						+
					</Button>
					<Button icon size="lg">
						+
					</Button>
				</div>
			</div>
		</DemoContainer>
	);
}
