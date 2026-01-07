import { Status } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function StatusDemo() {
	return (
		<DemoContainer title="Status">
			<div class="demo-section">
				<h4>All States</h4>
				<div class="cluster">
					<Status state="active" />
					<Status state="inactive" />
					<Status state="error" />
					<Status state="pending" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Custom Labels</h4>
				<div class="cluster">
					<Status state="active" label="Online" />
					<Status state="inactive" label="Offline" />
					<Status state="error" label="Failed" />
					<Status state="pending" label="Processing" />
				</div>
			</div>

			<div class="demo-section">
				<h4>In Context</h4>
				<div class="demo-stack">
					<div class="cluster-between">
						<span>API Server</span>
						<Status state="active" label="Healthy" />
					</div>
					<div class="cluster-between">
						<span>Database</span>
						<Status state="pending" label="Connecting" />
					</div>
					<div class="cluster-between">
						<span>Cache</span>
						<Status state="error" label="Down" />
					</div>
				</div>
			</div>
		</DemoContainer>
	);
}
