import { type JSX, splitProps, Show } from "solid-js";
import { Button } from "./Button";

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "accent";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
	/** When provided, renders a remove button */
	onRemove?: (e: MouseEvent) => void;
	/** Accessible label for the remove button */
	removeLabel?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
	default: "",
	success: "badge-success",
	error: "badge-error",
	warning: "badge-warning",
	info: "badge-info",
	accent: "badge-accent",
};

const CloseIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);

export function Badge(props: BadgeProps) {
	const [local, rest] = splitProps(props, ["variant", "class", "children", "onRemove", "removeLabel"]);

	const classes = () => {
		const parts = ["badge"];
		const variant = local.variant ?? "default";
		if (variant !== "default") {
			parts.push(variantClasses[variant]);
		}
		if (local.onRemove) {
			parts.push("badge-removable");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<span class={classes()} {...rest}>
			{local.children}
			<Show when={local.onRemove}>
				<Button
					variant="ghost"
					icon
					size="sm"
					class="badge-remove"
					onClick={(e) => {
						e.stopPropagation();
						local.onRemove?.(e);
					}}
					aria-label={local.removeLabel ?? "Remove"}
				>
					<CloseIcon />
				</Button>
			</Show>
		</span>
	);
}
