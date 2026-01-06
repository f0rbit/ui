import { type JSX, splitProps, createSignal, Show } from "solid-js";
import { Chevron } from "./Chevron";

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

	return (
		<div class="collapsible">
			<button class="collapsible-trigger" onClick={toggle}>
				{local.trigger}
				<Chevron class="collapsible-chevron" expanded={isOpen()} />
			</button>
			<Show when={isOpen()}>
				<div class="collapsible-content">{local.children}</div>
			</Show>
		</div>
	);
}
