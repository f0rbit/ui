import { type JSX, splitProps, createSignal, Show, onMount, onCleanup, createContext, useContext } from "solid-js";
import { isServer } from "solid-js/web";

type DropdownContextValue = {
	open: () => boolean;
	setOpen: (value: boolean) => void;
	close: () => void;
};

const DropdownContext = createContext<DropdownContextValue>();

export interface DropdownProps {
	children: JSX.Element;
}

export interface DropdownTriggerProps {
	children: JSX.Element;
}

export interface DropdownMenuProps {
	children: JSX.Element;
}

export interface DropdownItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?: () => void;
	active?: boolean;
	children: JSX.Element;
}

export function Dropdown(props: DropdownProps) {
	const [open, setOpen] = createSignal(false);
	let containerRef: HTMLDivElement | undefined;

	const close = () => setOpen(false);

	const handleClickOutside = (e: MouseEvent) => {
		if (!containerRef?.contains(e.target as Node)) {
			close();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && open()) {
			close();
		}
	};

	onMount(() => {
		if (isServer) return;
		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		if (isServer) return;
		document.removeEventListener("click", handleClickOutside);
		document.removeEventListener("keydown", handleKeyDown);
	});

	return (
		<DropdownContext.Provider value={{ open, setOpen, close }}>
			<div ref={el => (containerRef = el)} class="dropdown">
				{props.children}
			</div>
		</DropdownContext.Provider>
	);
}

export function DropdownTrigger(props: DropdownTriggerProps) {
	const ctx = useContext(DropdownContext);

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		ctx?.setOpen(!ctx.open());
	};

	return (
		<div class="dropdown-trigger" onClick={handleClick}>
			{props.children}
		</div>
	);
}

export function DropdownMenu(props: DropdownMenuProps) {
	const ctx = useContext(DropdownContext);

	return (
		<Show when={ctx?.open()}>
			<div class="dropdown-menu">{props.children}</div>
		</Show>
	);
}

export function DropdownItem(props: DropdownItemProps) {
	const [local, rest] = splitProps(props, ["onClick", "active", "children"]);
	const ctx = useContext(DropdownContext);

	const handleClick = () => {
		local.onClick?.();
		ctx?.close();
	};

	const classes = () => `dropdown-item ${local.active ? "dropdown-item-active" : ""}`.trim();

	return (
		<button type="button" class={classes()} onClick={handleClick} {...rest}>
			{local.children}
		</button>
	);
}

export function DropdownDivider() {
	return <div class="dropdown-divider" />;
}
