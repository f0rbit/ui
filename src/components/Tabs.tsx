import { type JSX, splitProps, createSignal, createContext, useContext, Show, For } from "solid-js";

type TabsContextValue = {
	activeTab: () => string;
	setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextValue>();

export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
	children: JSX.Element;
}

export interface TabListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children: JSX.Element;
}

export interface TabProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	children: JSX.Element;
}

export interface TabPanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
	value: string;
	children: JSX.Element;
}

export function Tabs(props: TabsProps) {
	const [local, rest] = splitProps(props, ["defaultValue", "value", "onValueChange", "children", "class"]);

	const [internalValue, setInternalValue] = createSignal(local.defaultValue ?? "");

	const isControlled = () => local.value !== undefined;
	const activeTab = () => (isControlled() ? local.value! : internalValue());

	const setActiveTab = (id: string) => {
		if (!isControlled()) {
			setInternalValue(id);
		}
		local.onValueChange?.(id);
	};

	const classes = () => `tabs ${local.class ?? ""}`.trim();

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<div class={classes()} {...rest}>
				{local.children}
			</div>
		</TabsContext.Provider>
	);
}

export function TabList(props: TabListProps) {
	const [local, rest] = splitProps(props, ["children", "class"]);

	const classes = () => `tab-list ${local.class ?? ""}`.trim();

	return (
		<div class={classes()} role="tablist" {...rest}>
			{local.children}
		</div>
	);
}

export function Tab(props: TabProps) {
	const [local, rest] = splitProps(props, ["value", "children", "class"]);
	const ctx = useContext(TabsContext);

	const isActive = () => ctx?.activeTab() === local.value;

	const handleClick = () => {
		ctx?.setActiveTab(local.value);
	};

	const classes = () => {
		const parts = ["tab"];
		if (isActive()) {
			parts.push("active");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<button
			type="button"
			role="tab"
			aria-selected={isActive()}
			tabIndex={isActive() ? 0 : -1}
			class={classes()}
			onClick={handleClick}
			{...rest}
		>
			{local.children}
		</button>
	);
}

export function TabPanel(props: TabPanelProps) {
	const [local, rest] = splitProps(props, ["value", "children", "class"]);
	const ctx = useContext(TabsContext);

	const isActive = () => ctx?.activeTab() === local.value;

	const classes = () => `tab-panel ${local.class ?? ""}`.trim();

	return (
		<Show when={isActive()}>
			<div class={classes()} role="tabpanel" {...rest}>
				{local.children}
			</div>
		</Show>
	);
}
