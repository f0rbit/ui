import { type JSX, splitProps, For, Show } from "solid-js";

export type TimelineItemVariant = "default" | "success" | "error" | "warning" | "info";

export interface TimelineItem {
	id: string | number;
	icon?: JSX.Element;
	title: string | JSX.Element;
	description?: string | JSX.Element;
	timestamp?: string | JSX.Element;
	variant?: TimelineItemVariant;
}

export interface TimelineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: TimelineItem[];
}

const variantClasses: Record<TimelineItemVariant, string> = {
	default: "",
	success: "timeline-item-success",
	error: "timeline-item-error",
	warning: "timeline-item-warning",
	info: "timeline-item-info",
};

function DefaultDot() {
	return <div class="timeline-dot" />;
}

export function Timeline(props: TimelineProps) {
	const [local, rest] = splitProps(props, ["items", "class"]);

	const classes = () => {
		const parts = ["timeline"];
		if (local.class) parts.push(local.class);
		return parts.join(" ");
	};

	return (
		<div class={classes()} {...rest}>
			<For each={local.items}>
				{(item, index) => (
					<div
						class={`timeline-item vertical-connector-item ${variantClasses[item.variant ?? "default"]}`}
					>
						<div class="timeline-indicator vertical-indicator">
							<Show when={item.icon} fallback={<DefaultDot />}>
								{item.icon}
							</Show>
						</div>
						<div class="vertical-connector" />
						<div class="timeline-content vertical-content">
							<div class="timeline-title">{item.title}</div>
							<Show when={item.description}>
								<div class="timeline-description">{item.description}</div>
							</Show>
							<Show when={item.timestamp}>
								<div class="timeline-timestamp">{item.timestamp}</div>
							</Show>
						</div>
					</div>
				)}
			</For>
		</div>
	);
}
