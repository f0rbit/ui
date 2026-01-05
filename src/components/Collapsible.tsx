import { type JSX, splitProps, createSignal, Show } from "solid-js";

export interface CollapsibleProps {
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	children: JSX.Element;
	trigger: JSX.Element | string;
}

export function Collapsible(props: CollapsibleProps) {
	const [local, rest] = splitProps(props, ["defaultOpen", "open", "onOpenChange", "children", "trigger"]);

	const [internalOpen, setInternalOpen] = createSignal(local.defaultOpen ?? false);

	const isControlled = () => local.open !== undefined;
	const isOpen = () => (isControlled() ? local.open! : internalOpen());

	const toggle = () => {
		const next = !isOpen();
		if (!isControlled()) {
			setInternalOpen(next);
		}
		local.onOpenChange?.(next);
	};

	const chevronClasses = () => `collapsible-chevron${isOpen() ? " collapsible-chevron-open" : ""}`;

	return (
		<div class="collapsible">
			<button class="collapsible-trigger" onClick={toggle}>
				{local.trigger}
				<svg class={chevronClasses()} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>
			<Show when={isOpen()}>
				<div class="collapsible-content">{local.children}</div>
			</Show>
		</div>
	);
}
