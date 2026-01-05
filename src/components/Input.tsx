import { type JSX, splitProps } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
}

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean;
}

export function Input(props: InputProps) {
	const [local, rest] = splitProps(props, ["error", "class", "disabled"]);
	const classes = () => `input ${local.error ? "input-error" : ""} ${local.class ?? ""}`.trim();
	return <input class={classes()} disabled={local.disabled} {...rest} />;
}

export function Textarea(props: TextareaProps) {
	const [local, rest] = splitProps(props, ["error", "class", "disabled"]);
	const classes = () => `textarea ${local.error ? "input-error" : ""} ${local.class ?? ""}`.trim();
	return <textarea class={classes()} disabled={local.disabled} {...rest} />;
}

export function Select(props: SelectProps) {
	const [local, rest] = splitProps(props, ["error", "class", "disabled", "children"]);
	const classes = () => `select ${local.error ? "input-error" : ""} ${local.class ?? ""}`.trim();
	return (
		<select class={classes()} disabled={local.disabled} {...rest}>
			{local.children}
		</select>
	);
}
