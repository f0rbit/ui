import { type JSX, splitProps } from "solid-js";

export type ToggleProps = {
	label?: string;
	description?: string;
	size?: "sm" | "md";
} & Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

export function Toggle(props: ToggleProps) {
	const [local, rest] = splitProps(props, ["label", "description", "size", "class", "disabled"]);
	const size = () => local.size ?? "md";
	const classes = () =>
		`toggle ${size() === "sm" ? "toggle-sm" : ""} ${local.disabled ? "toggle-disabled" : ""} ${local.class ?? ""}`.trim();

	return (
		<label class={classes()}>
			<input type="checkbox" class="toggle-input" role="switch" disabled={local.disabled} {...rest} />
			<span class="toggle-track">
				<span class="toggle-knob" />
			</span>
			{(local.label || local.description) && (
				<span class="toggle-content">
					{local.label && <span class="toggle-label">{local.label}</span>}
					{local.description && <span class="toggle-description">{local.description}</span>}
				</span>
			)}
		</label>
	);
}
