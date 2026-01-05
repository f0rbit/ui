import { type JSX, splitProps } from "solid-js";

export type StatusState = "active" | "inactive" | "error" | "pending";

export interface StatusProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	state: StatusState;
	label?: string;
}

const stateClasses: Record<StatusState, string> = {
	active: "status-active",
	inactive: "status-inactive",
	error: "status-error",
	pending: "status-pending",
};

const defaultLabels: Record<StatusState, string> = {
	active: "Active",
	inactive: "Inactive",
	error: "Error",
	pending: "Pending",
};

export function Status(props: StatusProps) {
	const [local, rest] = splitProps(props, ["state", "label", "class"]);

	const classes = () => {
		const parts = ["status", stateClasses[local.state]];
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	const displayLabel = () => local.label ?? defaultLabels[local.state];

	return (
		<span class={classes()} {...rest}>
			<span class="status-dot" />
			<span>{displayLabel()}</span>
		</span>
	);
}

export { Status as StatusBadge };
