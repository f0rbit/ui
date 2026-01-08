import { createSignal } from "solid-js";
import { FormField, Input, Select, Textarea } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function FormFieldDemo() {
	const [email, setEmail] = createSignal("");
	const emailError = () => {
		if (!email()) return undefined;
		if (!email().includes("@")) return "Please enter a valid email address";
		return undefined;
	};

	return (
		<DemoContainer title="FormField">
			<div class="demo-section">
				<h4>Basic with Input</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<FormField label="Username" id="username">
						<Input id="username" placeholder="Enter username" />
					</FormField>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Description</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<FormField
						label="Password"
						description="Must be at least 8 characters with one number"
						id="password"
					>
						<Input id="password" type="password" placeholder="Enter password" />
					</FormField>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Error State</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<FormField
						label="Email"
						description="We'll never share your email"
						error={emailError()}
						id="email"
					>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email()}
							onInput={(e) => setEmail(e.currentTarget.value)}
							error={!!emailError()}
						/>
					</FormField>
					<FormField label="Static Error Example" error="This field is required" id="static-error">
						<Input id="static-error" placeholder="Enter value" error />
					</FormField>
				</div>
			</div>

			<div class="demo-section">
				<h4>Required Field</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<FormField label="Full Name" required id="fullname">
						<Input id="fullname" placeholder="John Doe" />
					</FormField>
					<FormField label="Role" required id="role">
						<Select id="role">
							<option value="">Select a role</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
							<option value="guest">Guest</option>
						</Select>
					</FormField>
				</div>
			</div>

			<div class="demo-section">
				<h4>With Textarea</h4>
				<div class="stack stack-sm" style="max-width: 320px">
					<FormField
						label="Bio"
						description="Tell us a little about yourself"
						id="bio"
					>
						<Textarea id="bio" placeholder="I'm a software developer who..." />
					</FormField>
				</div>
			</div>
		</DemoContainer>
	);
}
