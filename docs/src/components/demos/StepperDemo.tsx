import { Stepper, Step } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function StepperDemo() {
	return (
		<DemoContainer title="Stepper">
			<div class="demo-section">
				<h4>Horizontal (Default)</h4>
				<Stepper>
					<Step title="Account" description="Create your account" status="completed" />
					<Step title="Profile" description="Set up your profile" status="current" />
					<Step title="Review" description="Review and submit" status="upcoming" />
				</Stepper>
			</div>

			<div class="demo-section">
				<h4>Vertical</h4>
				<Stepper orientation="vertical">
					<Step title="Order placed" description="Your order has been placed" status="completed" />
					<Step title="Processing" description="We are processing your order" status="completed" />
					<Step title="Shipping" description="Your order is on the way" status="current" />
					<Step title="Delivered" description="Package delivered" status="upcoming" />
				</Stepper>
			</div>

			<div class="demo-section">
				<h4>Simple Steps</h4>
				<Stepper>
					<Step title="Step 1" status="completed" />
					<Step title="Step 2" status="completed" />
					<Step title="Step 3" status="current" />
					<Step title="Step 4" status="upcoming" />
					<Step title="Step 5" status="upcoming" />
				</Stepper>
			</div>
		</DemoContainer>
	);
}
