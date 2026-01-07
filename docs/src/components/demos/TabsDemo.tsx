import { createSignal } from "solid-js";
import { Tabs, TabList, Tab, TabPanel } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function TabsDemo() {
	const [activeTab, setActiveTab] = createSignal("tab1");

	return (
		<DemoContainer title="Tabs">
			<div class="demo-section">
				<h4>Basic (Uncontrolled)</h4>
				<Tabs defaultValue="overview">
					<TabList>
						<Tab value="overview">Overview</Tab>
						<Tab value="features">Features</Tab>
						<Tab value="pricing">Pricing</Tab>
					</TabList>
					<TabPanel value="overview">
						<p>Welcome to the overview tab. This is the default active tab.</p>
					</TabPanel>
					<TabPanel value="features">
						<p>Here are the features: fast, lightweight, and accessible.</p>
					</TabPanel>
					<TabPanel value="pricing">
						<p>Our pricing is simple: free and open source.</p>
					</TabPanel>
				</Tabs>
			</div>

			<div class="demo-section">
				<h4>Controlled</h4>
				<div class="cluster">
					<button onClick={() => setActiveTab("tab1")}>Go to Tab 1</button>
					<button onClick={() => setActiveTab("tab2")}>Go to Tab 2</button>
					<button onClick={() => setActiveTab("tab3")}>Go to Tab 3</button>
				</div>
				<Tabs value={activeTab()} onValueChange={setActiveTab}>
					<TabList>
						<Tab value="tab1">Tab 1</Tab>
						<Tab value="tab2">Tab 2</Tab>
						<Tab value="tab3">Tab 3</Tab>
					</TabList>
					<TabPanel value="tab1">
						<p>Content for Tab 1. Use the buttons above to switch tabs externally.</p>
					</TabPanel>
					<TabPanel value="tab2">
						<p>Content for Tab 2. The active tab is controlled by state.</p>
					</TabPanel>
					<TabPanel value="tab3">
						<p>Content for Tab 3. Current value: {activeTab()}</p>
					</TabPanel>
				</Tabs>
			</div>
		</DemoContainer>
	);
}
