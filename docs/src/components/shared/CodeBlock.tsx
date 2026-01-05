import { createSignal } from "solid-js";

interface CodeBlockProps {
	code: string;
	language?: string;
}

export function CodeBlock(props: CodeBlockProps) {
	const [copied, setCopied] = createSignal(false);

	const copy = async () => {
		await navigator.clipboard.writeText(props.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div class="code-block">
			<div class="code-header">
				<span class="code-lang">{props.language ?? "tsx"}</span>
				<button class="code-copy" onClick={copy}>
					{copied() ? "Copied!" : "Copy"}
				</button>
			</div>
			<pre class="code-content">
				<code>{props.code}</code>
			</pre>
		</div>
	);
}
