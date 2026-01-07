import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function CardDemo() {
	return (
		<DemoContainer title="Card">
			<div class="demo-section">
				<h4>Basic Card</h4>
				<Card>
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>This is a description of the card content.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>This is the main content area of the card. You can put any content here.</p>
					</CardContent>
					<CardFooter>
						<Button variant="secondary">Cancel</Button>
						<Button>Save</Button>
					</CardFooter>
				</Card>
			</div>

			<div class="demo-section">
				<h4>Interactive Card</h4>
				<div class="cluster">
					<Card interactive>
						<CardContent>
							<p>Hover over me! I'm interactive.</p>
						</CardContent>
					</Card>
					<Card interactive>
						<CardContent>
							<p>Click to select this card.</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<div class="demo-section">
				<h4>Minimal Card</h4>
				<Card>
					<CardContent>
						<p>A simple card with just content.</p>
					</CardContent>
				</Card>
			</div>
		</DemoContainer>
	);
}
