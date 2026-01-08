import { type JSX, splitProps, For, Show, createContext, useContext } from "solid-js";

export type StepStatus = "completed" | "current" | "upcoming";

type StepperContextValue = {
	registerStep: () => number;
};

const StepperContext = createContext<StepperContextValue>();

export interface StepperProps extends JSX.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	children: JSX.Element;
}

export interface StepProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	icon?: JSX.Element;
	status?: StepStatus;
}

const statusClasses: Record<StepStatus, string> = {
	completed: "step-completed",
	current: "step-current",
	upcoming: "step-upcoming",
};

function CheckIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="13 4 6 12 3 9" />
		</svg>
	);
}

type StepContextValue = {
	orientation: () => "horizontal" | "vertical";
};

const StepContext = createContext<StepContextValue>();

export function Step(props: StepProps) {
	const [local, rest] = splitProps(props, ["title", "description", "icon", "status", "class"]);
	const stepperCtx = useContext(StepperContext);
	const stepCtx = useContext(StepContext);

	const stepNumber = stepperCtx?.registerStep() ?? 1;
	const orientation = () => stepCtx?.orientation() ?? "horizontal";

	const status = () => local.status ?? "upcoming";

	const isVertical = () => orientation() === "vertical";

	const classes = () => {
		const parts = ["step", statusClasses[status()]];
		if (isVertical()) {
			parts.push("vertical-connector-item");
		}
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	const indicatorClasses = () => {
		const parts = ["step-indicator"];
		if (isVertical()) {
			parts.push("vertical-indicator");
		}
		return parts.join(" ");
	};

	const contentClasses = () => {
		const parts = ["step-content"];
		if (isVertical()) {
			parts.push("vertical-content");
		}
		return parts.join(" ");
	};

	const connectorClasses = () => {
		const parts = ["step-connector"];
		if (isVertical()) {
			parts.push("vertical-connector");
		}
		return parts.join(" ");
	};

	const indicator = () => {
		if (status() === "completed") {
			return <CheckIcon />;
		}
		if (local.icon) {
			return local.icon;
		}
		return stepNumber;
	};

	return (
		<div class={classes()} {...rest}>
			<div class={indicatorClasses()}>{indicator()}</div>
			<div class={contentClasses()}>
				<div class="step-title">{local.title}</div>
				<Show when={local.description}>
					<div class="step-description">{local.description}</div>
				</Show>
			</div>
			<div class={connectorClasses()} />
		</div>
	);
}

export function Stepper(props: StepperProps) {
	const [local, rest] = splitProps(props, ["orientation", "class", "children"]);

	let stepCounter = 0;
	const registerStep = () => ++stepCounter;

	const orientation = () => local.orientation ?? "horizontal";

	const classes = () => {
		const parts = ["stepper", orientation() === "horizontal" ? "stepper-horizontal" : "stepper-vertical"];
		if (local.class) {
			parts.push(local.class);
		}
		return parts.join(" ");
	};

	return (
		<StepperContext.Provider value={{ registerStep }}>
			<StepContext.Provider value={{ orientation }}>
				<div class={classes()} {...rest}>
					{local.children}
				</div>
			</StepContext.Provider>
		</StepperContext.Provider>
	);
}
