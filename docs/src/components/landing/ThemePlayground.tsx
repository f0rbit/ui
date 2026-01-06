import { createSignal, createEffect } from "solid-js";
import { Button, Badge, Input, Stat, Status, Collapsible, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from "@f0rbit/ui";

interface ThemeSettings {
	accentHue: number;
	radius: number;
	spacing: number;
}

const defaultSettings: ThemeSettings = {
	accentHue: 280,
	radius: 0.25,
	spacing: 1,
};

const colorPresets = [
	{ name: "Purple", hue: 280 },
	{ name: "Blue", hue: 220 },
	{ name: "Green", hue: 150 },
	{ name: "Orange", hue: 30 },
	{ name: "Pink", hue: 330 },
	{ name: "Teal", hue: 180 },
];

export function ThemePlayground() {
	const [settings, setSettings] = createSignal<ThemeSettings>({ ...defaultSettings });
	let previewRef: HTMLDivElement | undefined;

	const updateSetting = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
		setSettings(prev => ({ ...prev, [key]: value }));
	};

	const resetSettings = () => {
		setSettings({ ...defaultSettings });
	};

	// Apply theme variables to the preview container
	createEffect(() => {
		if (!previewRef) return;
		const s = settings();
		
		// Calculate accent color based on hue with higher chroma for visibility
		const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const accentL = isDark ? 0.65 : 0.5;
		const accentC = 0.15; // Higher chroma for more saturated colors
		
		previewRef.style.setProperty("--accent", `oklch(${accentL} ${accentC} ${s.accentHue})`);
		previewRef.style.setProperty("--radius", `${s.radius}rem`);
		previewRef.style.setProperty("--radius-lg", `${s.radius * 2}rem`);
		// Pill radius for badges/status - scales from pill (9999px) down to match radius
		const pillRadius = s.radius < 0.5 ? `${s.radius + 0.5}rem` : "9999px";
		previewRef.style.setProperty("--radius-pill", pillRadius);
		previewRef.style.setProperty("--space-xs", `${0.25 * s.spacing}rem`);
		previewRef.style.setProperty("--space-sm", `${0.35 * s.spacing}rem`);
		previewRef.style.setProperty("--space-md", `${0.75 * s.spacing}rem`);
		previewRef.style.setProperty("--space-lg", `${1.5 * s.spacing}rem`);
	});

	const isDefault = () => {
		const s = settings();
		return (
			s.accentHue === defaultSettings.accentHue &&
			s.radius === defaultSettings.radius &&
			s.spacing === defaultSettings.spacing
		);
	};

	return (
		<div class="theme-playground">
			<div class="theme-controls">
				<div class="control-section">
					<label class="control-label">Accent Color</label>
					<div class="color-presets">
						{colorPresets.map(preset => (
							<button
								type="button"
								class="color-swatch"
								classList={{ active: settings().accentHue === preset.hue }}
								style={{ "--swatch-hue": preset.hue }}
								onClick={() => updateSetting("accentHue", preset.hue)}
								aria-label={preset.name}
								title={preset.name}
							/>
						))}
					</div>
				</div>

				<div class="control-section">
					<label class="control-label">
						Border Radius
						<span class="control-value">{settings().radius}rem</span>
					</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={settings().radius}
						onInput={(e) => updateSetting("radius", parseFloat(e.currentTarget.value))}
						class="control-slider"
					/>
					<div class="slider-labels">
						<span>Sharp</span>
						<span>Round</span>
					</div>
				</div>

				<div class="control-section">
					<label class="control-label">
						Spacing
						<span class="control-value">{settings().spacing.toFixed(1)}x</span>
					</label>
					<input
						type="range"
						min="0.5"
						max="1.5"
						step="0.1"
						value={settings().spacing}
						onInput={(e) => updateSetting("spacing", parseFloat(e.currentTarget.value))}
						class="control-slider"
					/>
					<div class="slider-labels">
						<span>Compact</span>
						<span>Spacious</span>
					</div>
				</div>

				<Button 
					variant="secondary" 
					onClick={resetSettings}
					disabled={isDefault()}
					class="reset-button"
				>
					Reset to Default
				</Button>
			</div>

			<div class="theme-preview" ref={previewRef}>
				<div class="preview-card">
					<div class="preview-card-header">
						<span class="preview-card-title">Dashboard</span>
						<Dropdown>
							<DropdownTrigger>
								<Button variant="ghost" size="sm">Options</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem>Edit</DropdownItem>
								<DropdownItem>Duplicate</DropdownItem>
								<DropdownItem>Delete</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
					<div class="preview-card-body">
						<div class="preview-stats">
							<Stat value="423" label="Users" />
							<Stat value="98%" label="Uptime" />
							<Stat value="12" label="Tasks" />
						</div>

						<Input placeholder="Search users..." />

						<div class="preview-actions">
							<Button>Submit</Button>
							<Button variant="secondary">Cancel</Button>
							<Spinner />
						</div>

						<div class="preview-badges">
							<Badge>Default</Badge>
							<Badge variant="success">Success</Badge>
							<Badge variant="warning">Warning</Badge>
							<Status state="active" />
						</div>

						<Collapsible trigger="View details">
							<p class="preview-text">Additional content that can be expanded or collapsed. This demonstrates the Collapsible component.</p>
						</Collapsible>
					</div>
				</div>
			</div>
		</div>
	);
}
