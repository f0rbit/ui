import { Timeline, type TimelineItem } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

const CheckIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M3 8l3 3 7-7" />
	</svg>
);

const AlertIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M8 5v4M8 11h.01" />
		<circle cx="8" cy="8" r="6" />
	</svg>
);

const InfoIcon = () => (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="8" cy="8" r="6" />
		<path d="M8 7v4M8 5h.01" />
	</svg>
);

const basicItems: TimelineItem[] = [
	{ id: 1, title: "Order placed", timestamp: "10:30 AM" },
	{ id: 2, title: "Payment confirmed", timestamp: "10:32 AM" },
	{ id: 3, title: "Processing", timestamp: "10:45 AM" },
	{ id: 4, title: "Shipped", timestamp: "2:15 PM" },
];

const variantItems: TimelineItem[] = [
	{ id: 1, title: "Build started", variant: "info", timestamp: "10:00 AM" },
	{ id: 2, title: "Tests passed", variant: "success", timestamp: "10:05 AM" },
	{ id: 3, title: "Linting warnings", variant: "warning", timestamp: "10:06 AM" },
	{ id: 4, title: "Deployment failed", variant: "error", timestamp: "10:10 AM" },
	{ id: 5, title: "Retrying deployment", variant: "default", timestamp: "10:15 AM" },
];

const customIconItems: TimelineItem[] = [
	{ id: 1, title: "Account created", icon: <CheckIcon />, variant: "success", timestamp: "Jan 1" },
	{ id: 2, title: "Profile completed", icon: <CheckIcon />, variant: "success", timestamp: "Jan 2" },
	{ id: 3, title: "Verification pending", icon: <AlertIcon />, variant: "warning", timestamp: "Jan 3" },
	{ id: 4, title: "Review in progress", icon: <InfoIcon />, variant: "info", timestamp: "Jan 4" },
];

const detailedItems: TimelineItem[] = [
	{
		id: 1,
		title: "Pull request opened",
		description: "feat: add new authentication flow",
		timestamp: "2 hours ago",
		variant: "info",
	},
	{
		id: 2,
		title: "Code review completed",
		description: "Approved by 2 reviewers with minor suggestions",
		timestamp: "1 hour ago",
		variant: "success",
	},
	{
		id: 3,
		title: "CI checks passed",
		description: "All 47 tests passed, coverage at 94%",
		timestamp: "45 minutes ago",
		variant: "success",
	},
	{
		id: 4,
		title: "Merged to main",
		description: "Squash and merge completed",
		timestamp: "30 minutes ago",
		variant: "success",
		icon: <CheckIcon />,
	},
];

export function TimelineDemo() {
	return (
		<DemoContainer title="Timeline">
			<div class="demo-section">
				<h4>Basic Timeline</h4>
				<Timeline items={basicItems} />
			</div>

			<div class="demo-section">
				<h4>With Variants</h4>
				<Timeline items={variantItems} />
			</div>

			<div class="demo-section">
				<h4>With Custom Icons</h4>
				<Timeline items={customIconItems} />
			</div>

			<div class="demo-section">
				<h4>With Descriptions</h4>
				<Timeline items={detailedItems} />
			</div>
		</DemoContainer>
	);
}
