import { Stat } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function StatDemo() {
	return (
		<DemoContainer title="Stat">
			<div class="demo-section">
				<h4>Basic Stats</h4>
				<div class="cluster">
					<Stat value={1234} label="Total Users" />
					<Stat value="99.9%" label="Uptime" />
					<Stat value="$12,345" label="Revenue" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Stats Grid</h4>
				<div class="demo-grid">
					<Stat value={42} label="Active Projects" />
					<Stat value={128} label="Team Members" />
					<Stat value="2.5k" label="Commits" />
					<Stat value="99%" label="Test Coverage" />
				</div>
			</div>

			<div class="demo-section">
				<h4>Large Numbers</h4>
				<div class="cluster">
					<Stat value="1.2M" label="Downloads" />
					<Stat value="50k+" label="Stars" />
					<Stat value="3.2k" label="Contributors" />
				</div>
			</div>
		</DemoContainer>
	);
}
