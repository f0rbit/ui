import { type JSX, splitProps, createSignal, createEffect, For, Show, onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Input } from "./Input";

export interface MultiSelectOption<T = string> {
	value: T;
	label: string;
	description?: string;
	disabled?: boolean;
}

export type MultiSelectLayout = "left" | "right" | "below";

export interface MultiSelectProps<T = string> {
	options: MultiSelectOption<T>[];
	value: T[];
	onChange: (value: T[]) => void;
	placeholder?: string;
	addLabel?: string;
	doneLabel?: string;
	emptyMessage?: string;
	searchable?: boolean;
	searchPlaceholder?: string;
	max?: number;
	disabled?: boolean;
	class?: string;
	/** Where to display the button relative to the badges. Default: "right" */
	layout?: MultiSelectLayout;
	renderBadge?: (option: MultiSelectOption<T>) => JSX.Element;
	renderOption?: (option: MultiSelectOption<T>) => JSX.Element;
}

export function MultiSelect<T = string>(props: MultiSelectProps<T>) {
	const [local, rest] = splitProps(props, [
		"options", "value", "onChange", "placeholder", "addLabel", "doneLabel",
		"emptyMessage", "searchable", "searchPlaceholder", "max", "disabled",
		"class", "layout", "renderBadge", "renderOption",
	]);

	const [open, setOpen] = createSignal(false);
	const [search, setSearch] = createSignal("");
	const [focusedIndex, setFocusedIndex] = createSignal(-1);

	let containerRef: HTMLDivElement | undefined;
	let searchInputRef: HTMLInputElement | undefined;

	const selectedSet = () => new Set(local.value);
	const isMaxReached = () => local.max !== undefined && local.value.length >= local.max;
	const layout = () => local.layout ?? "right";

	const selectedOptions = () => local.options.filter((opt) => selectedSet().has(opt.value));

	const availableOptions = () => {
		const selected = selectedSet();
		const query = search().toLowerCase();
		return local.options.filter((opt) => {
			if (selected.has(opt.value)) return false;
			if (query && !opt.label.toLowerCase().includes(query)) return false;
			return true;
		});
	};

	const toggleOption = (opt: MultiSelectOption<T>) => {
		if (opt.disabled) return;
		const selected = selectedSet();
		if (selected.has(opt.value)) {
			local.onChange(local.value.filter((v) => v !== opt.value));
		} else if (!isMaxReached()) {
			local.onChange([...local.value, opt.value]);
		}
	};

	const removeOption = (opt: MultiSelectOption<T>) => {
		if (local.disabled) return;
		local.onChange(local.value.filter((v) => v !== opt.value));
	};

	const handleToggleClick = () => {
		if (local.disabled) return;
		if (isMaxReached() && !open()) return; // Can't open if max reached
		setOpen(!open());
		setSearch("");
		setFocusedIndex(-1);
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (!containerRef?.contains(e.target as Node)) {
			setOpen(false);
			setSearch("");
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (!open()) return;
		if (e.key === "Escape") {
			setOpen(false);
			setSearch("");
			return;
		}
		const opts = availableOptions();
		if (opts.length === 0) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setFocusedIndex((i) => (i + 1) % opts.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setFocusedIndex((i) => (i - 1 + opts.length) % opts.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const idx = focusedIndex();
			if (idx >= 0 && idx < opts.length) toggleOption(opts[idx]);
		}
	};

	createEffect(() => {
		if (open() && local.searchable && searchInputRef) searchInputRef.focus();
	});

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

	const containerClass = () => {
		const parts = ["multi-select", "dropdown"];
		if (layout() === "below") parts.push("multi-select-below");
		if (layout() === "left") parts.push("multi-select-left");
		if (local.disabled) parts.push("multi-select-disabled");
		if (local.class) parts.push(local.class);
		return parts.join(" ");
	};

	const badges = () => (
		<div class="cluster">
			<Show when={selectedOptions().length > 0} fallback={
				<span class="text-muted">{local.placeholder ?? "Nothing selected"}</span>
			}>
				<For each={selectedOptions()}>
					{(opt) => (
						<Badge
							onRemove={local.disabled ? undefined : () => removeOption(opt)}
							removeLabel={`Remove ${opt.label}`}
						>
							{local.renderBadge ? local.renderBadge(opt) : opt.label}
						</Badge>
					)}
				</For>
			</Show>
		</div>
	);

	const button = () => (
		<Button
			size="sm"
			onClick={handleToggleClick}
			disabled={local.disabled || (isMaxReached() && !open())}
			aria-expanded={open()}
			aria-haspopup="listbox"
		>
			{open() ? (local.doneLabel ?? "Done") : (local.addLabel ?? "Add")}
		</Button>
	);

	return (
		<div
			ref={(el) => (containerRef = el)}
			class={containerClass()}
			role="listbox"
			aria-multiselectable="true"
			aria-disabled={local.disabled}
		>
			<div class="multi-select-header">
				<Show when={layout() === "left"}>{button()}</Show>
				{badges()}
				<Show when={layout() === "right"}>{button()}</Show>
			</div>
			<Show when={layout() === "below"}>
				{button()}
			</Show>

			<Show when={open()}>
				<div class="dropdown-menu multi-select-menu">
					<Show when={local.searchable}>
						<Input
							ref={(el) => (searchInputRef = el)}
							placeholder={local.searchPlaceholder ?? "Search..."}
							value={search()}
							onInput={(e) => {
								setSearch(e.currentTarget.value);
								setFocusedIndex(-1);
							}}
						/>
					</Show>
					<Show when={availableOptions().length > 0} fallback={
						<div class="multi-select-empty">{local.emptyMessage ?? "No options available"}</div>
					}>
						<For each={availableOptions()}>
							{(opt, index) => (
								<button
									type="button"
									class={`dropdown-item ${index() === focusedIndex() ? "active" : ""}`}
									onClick={() => toggleOption(opt)}
									disabled={opt.disabled || (isMaxReached() && !selectedSet().has(opt.value))}
									role="option"
									aria-selected={selectedSet().has(opt.value)}
								>
									{local.renderOption ? local.renderOption(opt) : (
										<>
											<span>{opt.label}</span>
											<Show when={opt.description}>
												<span class="text-muted text-xs">{opt.description}</span>
											</Show>
										</>
									)}
								</button>
							)}
						</For>
					</Show>
				</div>
			</Show>
		</div>
	);
}
