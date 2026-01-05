import { type JSX, splitProps, createSignal, Show } from "solid-js";

export interface ClampProps extends JSX.HTMLAttributes<HTMLDivElement> {
	lines?: number;
	showMoreText?: string;
	showLessText?: string;
}

export function Clamp(props: ClampProps) {
	const [local, rest] = splitProps(props, ["lines", "showMoreText", "showLessText", "class", "children"]);

	const lines = () => local.lines ?? 3;
	const showMoreText = () => local.showMoreText ?? "show more";
	const showLessText = () => local.showLessText ?? "show less";

	const [expanded, setExpanded] = createSignal(false);
	const [overflows, setOverflows] = createSignal(false);

	let contentRef: HTMLDivElement | undefined;

	const checkOverflow = () => {
		if (!contentRef) return;
		setOverflows(contentRef.scrollHeight > contentRef.clientHeight);
	};

	const toggle = () => setExpanded(prev => !prev);

	const wrapperClasses = () => `clamp ${local.class ?? ""}`.trim();

	const contentClasses = () => (expanded() ? "clamp-content" : "clamp-content clamp-clamped");

	return (
		<div class={wrapperClasses()} {...rest}>
			<div
				ref={el => {
					contentRef = el;
					requestAnimationFrame(checkOverflow);
				}}
				class={contentClasses()}
				style={{ "--clamp-lines": lines() }}
			>
				{local.children}
			</div>
			<Show when={overflows() || expanded()}>
				<button class="clamp-toggle" onClick={toggle}>
					{expanded() ? showLessText() : showMoreText()}
				</button>
			</Show>
		</div>
	);
}
