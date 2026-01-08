import { type JSX, splitProps, createEffect, onMount } from "solid-js";

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
	description?: string;
	indeterminate?: boolean;
}

export function Checkbox(props: CheckboxProps) {
	const [local, rest] = splitProps(props, ["label", "description", "indeterminate", "class", "disabled", "id"]);
	
	let inputRef: HTMLInputElement | undefined;
	
	const setIndeterminate = () => {
		if (inputRef) inputRef.indeterminate = local.indeterminate ?? false;
	};
	
	onMount(setIndeterminate);
	createEffect(setIndeterminate);
	
	const classes = () => 
		`checkbox ${local.disabled ? "checkbox-disabled" : ""} ${local.class ?? ""}`.trim();
	
	const inputId = () => local.id ?? (local.label ? `checkbox-${local.label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
	
	return (
		<label class={classes()}>
			<input
				ref={inputRef}
				type="checkbox"
				class="checkbox-input"
				id={inputId()}
				disabled={local.disabled}
				{...rest}
			/>
			<span class="checkbox-box" aria-hidden="true">
				<svg class="checkbox-check" viewBox="0 0 12 12" fill="none">
					<path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span class="checkbox-indeterminate" />
			</span>
			{(local.label || local.description) && (
				<span class="checkbox-content">
					{local.label && <span class="checkbox-label">{local.label}</span>}
					{local.description && <span class="checkbox-description">{local.description}</span>}
				</span>
			)}
		</label>
	);
}
