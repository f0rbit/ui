import { type JSX, splitProps, Show } from "solid-js";

export interface FormFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
	label: string;
	error?: string;
	description?: string;
	required?: boolean;
	children: JSX.Element;
	id?: string;
}

export function FormField(props: FormFieldProps) {
	const [local, rest] = splitProps(props, ["label", "error", "description", "required", "children", "id", "class"]);
	const classes = () => `form-field ${local.error ? "form-field-has-error" : ""} ${local.class ?? ""}`.trim();

	return (
		<div class={classes()} {...rest}>
			<label class="form-field-label" for={local.id}>
				{local.label}
				<Show when={local.required}>
					<span class="form-field-required" aria-hidden="true">*</span>
				</Show>
			</label>
			<Show when={local.description}>
				<span class="form-field-description">{local.description}</span>
			</Show>
			{local.children}
			<Show when={local.error}>
				<span class="form-field-error" role="alert">{local.error}</span>
			</Show>
		</div>
	);
}
