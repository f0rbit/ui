import { createSignal } from "solid-js";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "@f0rbit/ui";
import { DemoContainer } from "../shared/DemoContainer";

export function ModalDemo() {
	const [basicOpen, setBasicOpen] = createSignal(false);
	const [confirmOpen, setConfirmOpen] = createSignal(false);

	return (
		<DemoContainer title="Modal">
			<div class="demo-section">
				<h4>Basic Modal</h4>
				<div class="cluster">
					<Button onClick={() => setBasicOpen(true)}>Open Basic Modal</Button>
				</div>

				<Modal open={basicOpen()} onClose={() => setBasicOpen(false)}>
					<ModalHeader>
						<ModalTitle>Basic Modal</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>This is a basic modal with a title, body content, and footer actions.</p>
						<p>Click the close button or press Escape to dismiss.</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="secondary" onClick={() => setBasicOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setBasicOpen(false)}>Confirm</Button>
					</ModalFooter>
				</Modal>
			</div>

			<div class="demo-section">
				<h4>Confirmation Modal</h4>
				<div class="cluster">
					<Button variant="danger" onClick={() => setConfirmOpen(true)}>
						Delete Item
					</Button>
				</div>

				<Modal open={confirmOpen()} onClose={() => setConfirmOpen(false)}>
					<ModalHeader>
						<ModalTitle>Confirm Deletion</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>Are you sure you want to delete this item? This action cannot be undone.</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="secondary" onClick={() => setConfirmOpen(false)}>
							Cancel
						</Button>
						<Button variant="danger" onClick={() => setConfirmOpen(false)}>
							Delete
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		</DemoContainer>
	);
}
