import { CreateServerStore } from "app/stores/CreateServerStore";
import { Store } from "app/stores/Store";
import { Button, Container, Input, View } from "app/views";
import { Select } from "app/views/Select";
import React from "react";

import "./styles/create-server.scss";

export const CreateServer = Store.withStore(CreateServerStore, ({ store }) =>
{
	return (
		<Container>
			<View id="create-server">
				<Input placeholder="name" name="name" onChange={(e) => store.onInputChange("name", e.target.value)} value={store.getInputvalue("name")} />
				<Select placeholder="version" name="version" onChange={(e) => store.onInputChange("version", e.target.value)} value={store.getInputvalue("version")}>
					{store.versions.map((v, i) => <option key={i} value={v.id}>{v.id}</option>)}
				</Select>
				<Button onClick={store.create}>
					Create
				</Button>
			</View>
		</Container>
	);
});
