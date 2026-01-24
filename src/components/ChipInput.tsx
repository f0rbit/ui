import { type JSX, splitProps, For, Show, createSignal } from "solid-js";
import { Badge } from "./Badge";
import { Input } from "./Input";

export type ChipInputLayout = "above" | "below" | "left";

export interface ChipInputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	value: string[];
	onChange: (value: string[]) => void;
	transform?: (input: string) => string;
	validate?: (input: string, current: string[]) => boolean;
	allowDuplicates?: boolean;
	addKeys?: string[];
	error?: boolean;
	/** Where to display the chips relative to the input. Default: "above" */
	layout?: ChipInputLayout;
}

export function ChipInput(props: ChipInputProps) {
	const [local, rest] = splitProps(props, [
		"value", "onChange", "transform", "validate", "allowDuplicates",
		"addKeys", "error", "class", "disabled", "layout",
	]);

	const [inputValue, setInputValue] = createSignal("");

	const transform = () => local.transform ?? ((s: string) => s.trim());
	const addKeys = () => local.addKeys ?? ["Enter"];
	const validate = () => local.validate ?? ((s: string, current: string[]) => 
		s.length > 0 && (local.allowDuplicates || !current.includes(s))
	);
	const layout = () => local.layout ?? "above";

	const addChip = () => {
		const transformed = transform()(inputValue());
		if (!validate()(transformed, local.value)) return;
		local.onChange([...local.value, transformed]);
		setInputValue("");
	};

	const removeChip = (index: number) => {
		local.onChange(local.value.filter((_, i) => i !== index));
	};

	const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
		if (addKeys().includes(e.key)) {
			e.preventDefault();
			addChip();
		}
	};

	const chips = () => (
		<Show when={local.value.length > 0}>
			<div class="cluster">
				<For each={local.value}>
					{(chip, index) => (
						<Badge
							onRemove={local.disabled ? undefined : () => removeChip(index())}
							removeLabel={`Remove ${chip}`}
						>
							{chip}
						</Badge>
					)}
				</For>
			</div>
		</Show>
	);

	const input = () => (
		<Input
			value={inputValue()}
			onInput={(e) => setInputValue(e.currentTarget.value)}
			onKeyDown={handleKeyDown}
			disabled={local.disabled}
			error={local.error}
			{...rest}
		/>
	);

	const containerClass = () => {
		const parts = ["chip-input"];
		if (layout() === "left") parts.push("chip-input-left");
		if (local.class) parts.push(local.class);
		return parts.join(" ");
	};

	return (
		<div class={containerClass()}>
			<Show when={layout() === "above"}>{chips()}</Show>
			<Show when={layout() === "left"}>{chips()}</Show>
			{input()}
			<Show when={layout() === "below"}>{chips()}</Show>
		</div>
	);
}
