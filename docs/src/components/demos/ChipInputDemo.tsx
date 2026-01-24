import { createSignal } from "solid-js";
import { ChipInput, FormField } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function ChipInputDemo() {
	const [tags, setTags] = createSignal<string[]>(["react", "solid"]);
	const [emails, setEmails] = createSignal<string[]>(["user@example.com"]);
	const [emailError, setEmailError] = createSignal(false);
	const [keywords, setKeywords] = createSignal<string[]>([]);
	const [commaItems, setCommaItems] = createSignal<string[]>(["one", "two"]);

	const isValidEmail = (email: string): boolean =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	return (
		<DemoContainer title="ChipInput">
			<div class="demo-section">
				<h4>Basic Usage</h4>
				<p class="demo-hint">Press Enter to add tags</p>
				<ChipInput
					value={tags()}
					onChange={setTags}
					placeholder="Add a tag..."
				/>
			</div>

			<div class="demo-section">
				<h4>With Transform (Lowercase)</h4>
				<p class="demo-hint">Input is automatically lowercased</p>
				<ChipInput
					value={keywords()}
					onChange={setKeywords}
					transform={(s) => s.trim().toLowerCase()}
					placeholder="Add keyword..."
				/>
			</div>

			<div class="demo-section">
				<h4>With Validation (Email)</h4>
				<p class="demo-hint">Only valid emails are accepted. Try typing an invalid email and pressing Enter.</p>
				<FormField 
					label="Email addresses" 
					error={emailError() ? "Please enter a valid email address" : undefined}
				>
					<ChipInput
						value={emails()}
						onChange={(newEmails) => {
							setEmails(newEmails);
							setEmailError(false);
						}}
						validate={(email) => {
							const valid = isValidEmail(email);
							if (!valid) setEmailError(true);
							return valid;
						}}
						error={emailError()}
						placeholder="Add email..."
					/>
				</FormField>
			</div>

			<div class="demo-section">
				<h4>Custom Add Keys (Comma)</h4>
				<p class="demo-hint">Press Enter or Comma to add</p>
				<ChipInput
					value={commaItems()}
					onChange={setCommaItems}
					addKeys={["Enter", ","]}
					placeholder="Type and press comma..."
				/>
			</div>

			<div class="demo-section">
				<h4>Layout Options</h4>
				<div class="stack">
					<div>
						<p class="demo-hint">Above (default)</p>
						<ChipInput
							value={["chip", "above"]}
							onChange={() => {}}
							placeholder="Chips above..."
							layout="above"
						/>
					</div>
					<div>
						<p class="demo-hint">Below</p>
						<ChipInput
							value={["chip", "below"]}
							onChange={() => {}}
							placeholder="Chips below..."
							layout="below"
						/>
					</div>
					<div>
						<p class="demo-hint">Left</p>
						<ChipInput
							value={["left"]}
							onChange={() => {}}
							placeholder="Chips on left..."
							layout="left"
						/>
					</div>
				</div>
			</div>

			<div class="demo-section">
				<h4>Disabled State</h4>
				<ChipInput
					value={["disabled", "chips"]}
					onChange={() => {}}
					placeholder="Disabled..."
					disabled
				/>
			</div>
		</DemoContainer>
	);
}
