import { Empty, Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

function InboxIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</svg>
	);
}

function SearchIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

export function EmptyDemo() {
	return (
		<DemoContainer title="Empty">
			<div class="demo-section">
				<h4>With Title and Description</h4>
				<Empty title="No items found" description="Try adjusting your search or filters to find what you're looking for." />
			</div>

			<div class="demo-section">
				<h4>With Action Button</h4>
				<Empty title="No projects yet" description="Get started by creating your first project.">
					<Button>Create Project</Button>
				</Empty>
			</div>

			<div class="demo-section">
				<h4>With Custom Icon</h4>
				<Empty icon={<InboxIcon />} title="Inbox is empty" description="You're all caught up! No new messages." />
			</div>

			<div class="demo-section">
				<h4>Search Results Empty</h4>
				<Empty icon={<SearchIcon />} title="No results found" description="We couldn't find anything matching your search.">
					<Button variant="secondary">Clear Search</Button>
				</Empty>
			</div>
		</DemoContainer>
	);
}
