import { JSX, splitProps } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	interactive?: boolean;
}

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Card(props: CardProps) {
	const [local, rest] = splitProps(props, ["interactive", "class", "children"]);

	const classes = () => {
		const parts = ["card"];
		if (local.interactive) {
			parts.push("card-interactive");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	);
}

export function CardHeader(props: CardHeaderProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<div class={`card-header ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}

export function CardTitle(props: CardTitleProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<h3 class={`card-title ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</h3>
	);
}

export function CardDescription(props: CardDescriptionProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<p class={`card-description ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</p>
	);
}

export function CardContent(props: CardContentProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<div class={`card-content ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}

export function CardFooter(props: CardFooterProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<div class={`card-footer ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}
