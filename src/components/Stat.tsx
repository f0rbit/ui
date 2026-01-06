import { type JSX, splitProps } from "solid-js";

type StatProps = {
	value: string | number;
	label: string;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, "children">;

export function Stat(props: StatProps): JSX.Element {
	const [local, rest] = splitProps(props, ["value", "label", "class"]);

	return (
		<div class={local.class ? `stat ${local.class}` : "stat"} {...rest}>
			<span class="stat-value">{local.value}</span>
			<span class="stat-label">{local.label}</span>
		</div>
	);
}
export type { StatProps };
