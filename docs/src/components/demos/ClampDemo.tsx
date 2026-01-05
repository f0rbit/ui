import { Clamp } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export function ClampDemo() {
	return (
		<DemoContainer title="Clamp">
			<div class="demo-section">
				<h4>Default (3 lines)</h4>
				<Clamp>
					<p>{longText}</p>
				</Clamp>
			</div>

			<div class="demo-section">
				<h4>2 Lines</h4>
				<Clamp lines={2}>
					<p>{longText}</p>
				</Clamp>
			</div>

			<div class="demo-section">
				<h4>4 Lines</h4>
				<Clamp lines={4}>
					<p>{longText}</p>
				</Clamp>
			</div>

			<div class="demo-section">
				<h4>Custom Toggle Text</h4>
				<Clamp lines={2} showMoreText="Read more" showLessText="Read less">
					<p>{longText}</p>
				</Clamp>
			</div>
		</DemoContainer>
	);
}
