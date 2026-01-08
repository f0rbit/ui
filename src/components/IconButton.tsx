import { JSX, splitProps } from "solid-js";

export type IconButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	variant?: IconButtonVariant;
	size?: IconButtonSize;
	loading?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
	primary: "",
	secondary: "btn-secondary",
	ghost: "btn-ghost",
	danger: "btn-danger",
};

const sizeClasses: Record<IconButtonSize, string> = {
	sm: "btn-sm",
	md: "",
	lg: "btn-lg",
};

export function IconButton(props: IconButtonProps) {
	const [local, rest] = splitProps(props, ["label", "variant", "size", "loading", "class", "disabled", "children"]);

	const classes = () => {
		const parts = ["btn", "btn-icon"];
		parts.push(variantClasses[local.variant ?? "primary"]);
		if (local.size && local.size !== "md") {
			parts.push(sizeClasses[local.size]);
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.filter(Boolean).join(" ");
	};

	return (
		<button
			class={classes()}
			aria-label={local.label}
			disabled={local.disabled || local.loading}
			{...rest}
		>
			{local.loading ? <span class="spinner spinner-sm" /> : local.children}
		</button>
	);
}
