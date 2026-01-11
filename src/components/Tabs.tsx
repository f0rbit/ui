import { type JSX, splitProps, onMount, onCleanup, createSignal } from "solid-js";

/**
 * A tab container component that manages tab selection and panel visibility.
 *
 * Uses DOM-based discovery via data attributes, making it compatible with
 * Astro's island architecture where each child component hydrates independently.
 *
 * @example Basic usage in SolidJS
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabList>
 *     <Tab value="tab1">First Tab</Tab>
 *     <Tab value="tab2">Second Tab</Tab>
 *   </TabList>
 *   <TabPanel value="tab1">First panel content</TabPanel>
 *   <TabPanel value="tab2">Second panel content</TabPanel>
 * </Tabs>
 * ```
 *
 * @example Usage in Astro MDX (each component needs client:load)
 * ```mdx
 * <Tabs defaultValue="tab1" client:load>
 *   <TabList client:load>
 *     <Tab value="tab1" client:load>First Tab</Tab>
 *     <Tab value="tab2" client:load>Second Tab</Tab>
 *   </TabList>
 *   <TabPanel value="tab1" client:load>First panel content</TabPanel>
 *   <TabPanel value="tab2" client:load>Second panel content</TabPanel>
 * </Tabs>
 * ```
 *
 * @example Creating a wrapper to avoid multiple client:load directives
 * ```tsx
 * // MyTabs.tsx - your custom wrapper
 * import { Tabs, TabList, Tab, TabPanel } from '@f0rbit/ui';
 *
 * export function MyTabs() {
 *   return (
 *     <Tabs defaultValue="tab1">
 *       <TabList>
 *         <Tab value="tab1">First</Tab>
 *         <Tab value="tab2">Second</Tab>
 *       </TabList>
 *       <TabPanel value="tab1">Content 1</TabPanel>
 *       <TabPanel value="tab2">Content 2</TabPanel>
 *     </Tabs>
 *   );
 * }
 *
 * // Then in Astro: <MyTabs client:load />
 * ```
 */
export interface TabsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The value of the initially selected tab */
	defaultValue?: string;
	children: JSX.Element;
}

export function Tabs(props: TabsProps) {
	const [local, rest] = splitProps(props, ["defaultValue", "children", "class"]);
	let containerRef: HTMLDivElement | undefined;
	const [activeTab, setActiveTab] = createSignal(local.defaultValue ?? "");

	const updateTabs = (value: string) => {
		if (!containerRef) return;

		const tabs = containerRef.querySelectorAll<HTMLButtonElement>("[data-tab-value]");
		tabs.forEach((tab) => {
			const isActive = tab.dataset.tabValue === value;
			tab.setAttribute("aria-selected", String(isActive));
			tab.setAttribute("tabindex", isActive ? "0" : "-1");
			tab.classList.toggle("active", isActive);
		});

		const panels = containerRef.querySelectorAll<HTMLDivElement>("[data-panel-value]");
		panels.forEach((panel) => {
			const isActive = panel.dataset.panelValue === value;
			panel.hidden = !isActive;
		});
	};

	const initializeTabs = () => {
		if (!containerRef) return;

		let value = activeTab();
		if (!value) {
			const firstTab = containerRef.querySelector<HTMLButtonElement>("[data-tab-value]");
			value = firstTab?.dataset.tabValue ?? "";
			if (value) setActiveTab(value);
		}

		if (value) updateTabs(value);
	};

	onMount(() => {
		if (!containerRef) return;

		// Use event delegation for clicks - handles dynamically added children
		containerRef.addEventListener("click", (e) => {
			const tab = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-tab-value]");
			if (tab?.dataset.tabValue) {
				setActiveTab(tab.dataset.tabValue);
				updateTabs(tab.dataset.tabValue);
			}
		});

		// Initialize with any children already present
		initializeTabs();

		// Watch for new children being added (e.g., Astro islands hydrating)
		const observer = new MutationObserver(() => {
			initializeTabs();
		});

		observer.observe(containerRef, {
			childList: true,
			subtree: true,
		});

		onCleanup(() => observer.disconnect());
	});

	const classes = () => `tabs ${local.class ?? ""}`.trim();

	return (
		<div ref={containerRef} class={classes()} data-default-value={local.defaultValue} {...rest}>
			{local.children}
		</div>
	);
}

/**
 * Container for Tab buttons. Provides the tablist role for accessibility.
 *
 * In Astro, requires `client:load` directive.
 */
export interface TabListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children: JSX.Element;
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

/**
 * A tab button that switches the active panel when clicked.
 *
 * The `value` prop must match a corresponding `TabPanel` value.
 * In Astro, requires `client:load` directive.
 */
export interface TabProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Unique identifier that links this tab to its panel */
	value: string;
	children: JSX.Element;
}

export function Tab(props: TabProps) {
	const [local, rest] = splitProps(props, ["value", "children", "class"]);
	const classes = () => `tab ${local.class ?? ""}`.trim();

	return (
		<button
			type="button"
			role="tab"
			aria-selected="false"
			tabIndex={-1}
			class={classes()}
			data-tab-value={local.value}
			{...rest}
		>
			{local.children}
		</button>
	);
}

/**
 * Content panel that is shown when its corresponding Tab is active.
 *
 * The `value` prop must match a corresponding `Tab` value.
 * Panels are hidden by default and shown when their tab is selected.
 * In Astro, requires `client:load` directive.
 */
export interface TabPanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Unique identifier that links this panel to its tab */
	value: string;
	children: JSX.Element;
}

export function TabPanel(props: TabPanelProps) {
	const [local, rest] = splitProps(props, ["value", "children", "class"]);
	const classes = () => `tab-panel ${local.class ?? ""}`.trim();

	return (
		<div class={classes()} role="tabpanel" data-panel-value={local.value} hidden {...rest}>
			{local.children}
		</div>
	);
}
