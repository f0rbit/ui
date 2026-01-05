import { For } from "solid-js";

interface PropDef {
	name: string;
	type: string;
	default?: string;
	description: string;
}

interface PropsTableProps {
	props: PropDef[];
}

export function PropsTable(props: PropsTableProps) {
	return (
		<div class="props-table-wrapper">
			<table class="props-table">
				<thead>
					<tr>
						<th>Prop</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<For each={props.props}>
						{prop => (
							<tr>
								<td>
									<code>{prop.name}</code>
								</td>
								<td>
									<code>{prop.type}</code>
								</td>
								<td>{prop.default ? <code>{prop.default}</code> : "—"}</td>
								<td>{prop.description}</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
