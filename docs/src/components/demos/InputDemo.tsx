import { Input, Textarea, Select } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function InputDemo() {
	return (
		<DemoContainer title="Input">
			<div class="demo-section">
				<h4>Input</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<Input placeholder="Enter your name..." />
					<Input placeholder="Error state" error />
					<Input placeholder="Disabled" disabled />
					<Input type="password" placeholder="Password" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Textarea</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<Textarea placeholder="Enter a longer message..." />
					<Textarea placeholder="Error state" error />
					<Textarea placeholder="Disabled" disabled />
				</div>
			</div>

			<div class="demo-section">
				<h4>Select</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<Select>
						<option value="">Select an option</option>
						<option value="1">Option 1</option>
						<option value="2">Option 2</option>
						<option value="3">Option 3</option>
					</Select>
					<Select error>
						<option value="">Selection required</option>
						<option value="1">Option 1</option>
					</Select>
					<Select disabled>
						<option value="">Disabled select</option>
					</Select>
				</div>
			</div>
		</DemoContainer>
	);
}
