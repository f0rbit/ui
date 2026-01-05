import { JSX, splitProps } from "solid-js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: boolean;
	loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "btn-primary",
	secondary: "btn-secondary",
	ghost: "btn-ghost",
	danger: "btn-danger",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "btn-sm",
	md: "",
	lg: "btn-lg",
};

export function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, ["variant", "size", "icon", "loading", "class", "disabled", "children"]);

	const classes = () => {
		const parts = ["btn"];
		parts.push(variantClasses[local.variant ?? "primary"]);
		if (local.size && local.size !== "md") {
			parts.push(sizeClasses[local.size]);
		}
		if (local.icon) {
			parts.push("btn-icon");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<button class={classes()} disabled={local.disabled || local.loading} {...rest}>
			{local.loading ? <span class="spinner spinner-sm" /> : local.children}
		</button>
	);
}
