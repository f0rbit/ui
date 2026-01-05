import { type JSX, splitProps, Show, onMount, onCleanup, createContext, useContext } from "solid-js";
import { Portal, isServer } from "solid-js/web";

type ModalContextValue = { onClose: () => void };
const ModalContext = createContext<ModalContextValue>();

export interface ModalProps extends JSX.DialogHtmlAttributes<HTMLDialogElement> {
	open: boolean;
	onClose: () => void;
}

export interface ModalHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export interface ModalTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {}
export interface ModalBodyProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export interface ModalFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Modal(props: ModalProps) {
	const [local, rest] = splitProps(props, ["open", "onClose", "class", "children"]);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && local.open) {
			local.onClose();
		}
	};

	const handleOverlayClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			local.onClose();
		}
	};

	onMount(() => {
		if (isServer) return;
		document.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		if (isServer) return;
		document.removeEventListener("keydown", handleKeyDown);
	});

	const classes = () => `modal ${local.class ?? ""}`.trim();

	return (
		<Show when={local.open}>
			<Portal>
				<ModalContext.Provider value={{ onClose: local.onClose }}>
					<div class="overlay" onClick={handleOverlayClick} onKeyDown={(e: KeyboardEvent) => e.key === "Escape" && local.onClose()} role="presentation">
						<dialog class={classes()} open aria-modal="true" {...rest}>
							{local.children}
						</dialog>
					</div>
				</ModalContext.Provider>
			</Portal>
		</Show>
	);
}

export function ModalHeader(props: ModalHeaderProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useContext(ModalContext);

	return (
		<div class={`modal-header ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
			<Show when={ctx}>
				<button type="button" class="modal-close" onClick={ctx?.onClose} aria-label="Close">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</Show>
		</div>
	);
}

export function ModalTitle(props: ModalTitleProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<h2 class={`modal-title ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</h2>
	);
}

export function ModalBody(props: ModalBodyProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<div class={`modal-body ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}

export function ModalFooter(props: ModalFooterProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);

	return (
		<div class={`modal-footer ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}
