import { Badge } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function BadgeDemo() {
	return (
		<DemoContainer title="Badge">
			<div class="demo-section">
				<h4>Variants</h4>
				<div class="demo-row">
					<Badge>Default</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="error">Error</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="info">Info</Badge>
					<Badge variant="accent">Accent</Badge>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Icons</h4>
				<div class="demo-row">
					<Badge variant="success">
						<span>✓</span> Completed
					</Badge>
					<Badge variant="error">
						<span>✕</span> Failed
					</Badge>
					<Badge variant="warning">
						<span>⚠</span> Warning
					</Badge>
					<Badge variant="info">
						<span>ℹ</span> Info
					</Badge>
				</div>
			</div>
		</DemoContainer>
	);
}
