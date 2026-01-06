import { type JSX, splitProps } from "solid-js";

type EmptyProps = {
	icon?: JSX.Element;
	title?: string;
	description?: string;
	children?: JSX.Element;
};

export function Empty(props: EmptyProps): JSX.Element {
	const [local] = splitProps(props, ["icon", "title", "description", "children"]);

	return (
		<div class="empty">
			{local.icon && <div class="empty-icon">{local.icon}</div>}
			{local.title && <h3 class="empty-title">{local.title}</h3>}
			{local.description && <p class="empty-description">{local.description}</p>}
			{local.children}
		</div>
	);
}
export type { EmptyProps };
