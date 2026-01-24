import { type JSX, splitProps, createSignal, For, Show } from "solid-js";
import { Chevron } from "./Chevron";
import { Button } from "./Button";

export interface TreeNode<T = unknown> {
	id: string;
	label: string;
	children?: TreeNode<T>[];
	data?: T;
}

export interface TreeProps<T = unknown> {
	nodes: TreeNode<T>[] | TreeNode<T>;
	renderNode?: (node: TreeNode<T>, depth: number) => JSX.Element;
	renderActions?: (node: TreeNode<T>, depth: number) => JSX.Element;
	showGuides?: boolean;
	defaultExpanded?: boolean | string[];
	expanded?: string[];
	onExpandedChange?: (expanded: string[]) => void;
	emptyMessage?: string;
	class?: string;
}

export interface FlatTreeItem {
	id: string;
	label: string;
	parentId?: string | null;
	[key: string]: unknown;
}

const collectAllIds = <T,>(nodes: TreeNode<T>[]): string[] =>
	nodes.flatMap((n) => [n.id, ...(n.children ? collectAllIds(n.children) : [])]);

export function buildTree<T extends FlatTreeItem>(items: T[]): TreeNode<T>[] {
	const childrenMap = new Map<string | null, T[]>();
	for (const item of items) {
		const parentId = item.parentId ?? null;
		const siblings = childrenMap.get(parentId) ?? [];
		siblings.push(item);
		childrenMap.set(parentId, siblings);
	}

	const build = (parentId: string | null): TreeNode<T>[] => {
		const children = childrenMap.get(parentId) ?? [];
		return children.map((item) => ({
			id: item.id,
			label: item.label,
			data: item,
			children: build(item.id),
		}));
	};

	return build(null);
}

export function Tree<T = unknown>(props: TreeProps<T>) {
	const [local, rest] = splitProps(props, [
		"nodes", "renderNode", "renderActions", "showGuides",
		"defaultExpanded", "expanded", "onExpandedChange", "emptyMessage", "class",
	]);

	const normalizedNodes = (): TreeNode<T>[] => {
		const n = local.nodes;
		return Array.isArray(n) ? n : [n];
	};

	const initExpanded = (): string[] => {
		if (local.defaultExpanded === false) return [];
		if (Array.isArray(local.defaultExpanded)) return local.defaultExpanded;
		return collectAllIds(normalizedNodes());
	};

	const [internalExpanded, setInternalExpanded] = createSignal<string[]>(initExpanded());
	const isControlled = () => local.expanded !== undefined;
	const expandedIds = () => (isControlled() ? local.expanded! : internalExpanded());
	const showGuides = () => local.showGuides !== false;

	const toggle = (id: string) => {
		const current = expandedIds();
		const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
		if (!isControlled()) setInternalExpanded(next);
		local.onExpandedChange?.(next);
	};

	const renderTreeNode = (
		node: TreeNode<T>,
		depth: number,
		index: number,
		siblingCount: number,
		ancestorIsLast: boolean[]
	): JSX.Element => {
		const hasChildren = () => (node.children?.length ?? 0) > 0;
		const isLast = () => index === siblingCount - 1;
		const expanded = () => expandedIds().includes(node.id);

		return (
			<>
				<div class="tree-node" role="treeitem" aria-expanded={hasChildren() ? expanded() : undefined}>
					<Show when={showGuides()}>
						<div class="tree-guides">
							<For each={ancestorIsLast}>
								{(wasLast) => <span class={wasLast ? "tree-guide-empty" : "tree-guide-line"} />}
							</For>
							<Show when={depth > 0}>
								<span class={isLast() ? "tree-guide-corner" : "tree-guide-tee"} />
							</Show>
						</div>
					</Show>
				<Show when={hasChildren()}>
					<Button
						variant="ghost"
						icon
						size="sm"
						onClick={() => toggle(node.id)}
						aria-label={expanded() ? "Collapse" : "Expand"}
						class="tree-toggle"
					>
						<Chevron expanded={expanded()} size="0.75em" />
					</Button>
				</Show>
					<span class="tree-content">
						{local.renderNode ? local.renderNode(node, depth) : node.label}
					</span>
					<Show when={local.renderActions}>
						<span class="tree-actions">{local.renderActions!(node, depth)}</span>
					</Show>
				</div>
				<Show when={hasChildren() && expanded()}>
					<For each={node.children}>
						{(child, i) => renderTreeNode(child, depth + 1, i(), node.children!.length, [...ancestorIsLast, isLast()])}
					</For>
				</Show>
			</>
		);
	};

	return (
		<div class={`tree ${local.class ?? ""}`} role="tree" {...rest}>
			<Show when={normalizedNodes().length === 0}>
				<div class="tree-empty">{local.emptyMessage ?? "No items"}</div>
			</Show>
			<For each={normalizedNodes()}>
				{(node, i) => renderTreeNode(node, 0, i(), normalizedNodes().length, [])}
			</For>
		</div>
	);
}
