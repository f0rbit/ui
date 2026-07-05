import { type JSX, splitProps } from "solid-js";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
	sm: "spinner-sm",
	md: "",
	lg: "spinner-lg",
};

export function Spinner(props: SpinnerProps) {
	const [local, rest] = splitProps(props, ["size", "class"]);

	const classes = () => {
		const parts = ["spinner"];
		const size = local.size ?? "md";
		if (size !== "md") {
			parts.push(sizeClasses[size]);
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return <span class={classes()} {...rest} />;
}
