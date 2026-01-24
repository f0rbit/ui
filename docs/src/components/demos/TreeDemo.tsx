import { createSignal } from "solid-js";
import { Tree, buildTree, Button } from "@f0rbit/ui";
import type { TreeNode } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

const fileSystem: TreeNode[] = [
	{
		id: "src",
		label: "src",
		children: [
			{
				id: "components",
				label: "components",
				children: [
					{ id: "button", label: "Button.tsx" },
					{ id: "input", label: "Input.tsx" },
					{ id: "modal", label: "Modal.tsx" },
				],
			},
			{
				id: "utils",
				label: "utils",
				children: [
					{ id: "helpers", label: "helpers.ts" },
					{ id: "types", label: "types.ts" },
				],
			},
			{ id: "index", label: "index.ts" },
		],
	},
	{
		id: "docs",
		label: "docs",
		children: [
			{ id: "readme", label: "README.md" },
			{ id: "api", label: "API.md" },
		],
	},
];

const flatItems = [
	{ id: "1", label: "Animals", parentId: null },
	{ id: "2", label: "Mammals", parentId: "1" },
	{ id: "3", label: "Dog", parentId: "2" },
	{ id: "4", label: "Cat", parentId: "2" },
	{ id: "5", label: "Birds", parentId: "1" },
	{ id: "6", label: "Eagle", parentId: "5" },
	{ id: "7", label: "Plants", parentId: null },
	{ id: "8", label: "Trees", parentId: "7" },
];

export function TreeDemo() {
	const [expanded, setExpanded] = createSignal<string[]>(["src", "components"]);

	return (
		<DemoContainer title="Tree">
			<div class="demo-section">
				<h4>Basic Tree</h4>
				<Tree nodes={fileSystem} defaultExpanded={["src"]} />
			</div>

			<div class="demo-section">
				<h4>Controlled Expansion</h4>
				<p class="demo-hint">Expanded: {expanded().join(", ") || "none"}</p>
				<Tree
					nodes={fileSystem}
					expanded={expanded()}
					onExpandedChange={setExpanded}
				/>
			</div>

			<div class="demo-section">
				<h4>With Actions</h4>
				<Tree
					nodes={fileSystem}
					defaultExpanded={["src"]}
					renderActions={(node: TreeNode) => (
						<Button
							size="sm"
							variant="ghost"
							onClick={() => console.log("Selected:", node.label)}
						>
							Select
						</Button>
					)}
				/>
			</div>

			<div class="demo-section">
				<h4>Built from Flat Data</h4>
				<p class="demo-hint">Using buildTree() utility</p>
				<Tree nodes={buildTree(flatItems)} defaultExpanded />
			</div>

			<div class="demo-section">
				<h4>Empty State</h4>
				<Tree nodes={[]} emptyMessage="No files found" />
			</div>
		</DemoContainer>
	);
}
