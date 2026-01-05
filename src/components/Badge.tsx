import { JSX, splitProps } from "solid-js";

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "accent";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
	default: "",
	success: "badge-success",
	error: "badge-error",
	warning: "badge-warning",
	info: "badge-info",
	accent: "badge-accent",
};

export function Badge(props: BadgeProps) {
	const [local, rest] = splitProps(props, ["variant", "class", "children"]);

	const classes = () => {
		const parts = ["badge"];
		const variant = local.variant ?? "default";
		if (variant !== "default") {
			parts.push(variantClasses[variant]);
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<span class={classes()} {...rest}>
			{local.children}
		</span>
	);
}
