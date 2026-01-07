import { type JSX, splitProps } from "solid-js";

export type ChevronFacing = "right" | "down";

export interface ChevronProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
	expanded?: boolean;
	/** Which way the chevron points. Default: "right" */
	facing?: ChevronFacing;
	size?: number | string;
}

export function Chevron(props: ChevronProps) {
	const [local, rest] = splitProps(props, ["expanded", "facing", "size", "class"]);

	const classes = () => {
		const parts = ["chevron"];
		if (local.facing === "down") {
			parts.push("chevron-down");
		}
		if (local.expanded) {
			parts.push("active");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	const size = () => local.size ?? "1em";

	return (
		<svg class={classes()} viewBox="0 0 24 24" width={size()} height={size()} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...rest}>
			<path d="m9 18 6-6-6-6" />
		</svg>
	);
}
