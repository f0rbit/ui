import { type JSX } from "solid-js";

interface DemoContainerProps {
	title: string;
	children: JSX.Element;
}

export function DemoContainer(props: DemoContainerProps) {
	return (
		<div class="demo-container">
			<div class="demo-header">
				<span class="demo-title">{props.title}</span>
			</div>
			<div class="demo-preview">{props.children}</div>
		</div>
	);
}
