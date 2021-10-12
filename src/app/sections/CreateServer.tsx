import { CreateServerStore } from "app/stores/CreateServerStore";
import { Store } from "app/stores/Store";
import { Container, View } from "app/views";
import React from "react";

import "./styles/create-server.scss";

export const CreateServer = Store.withStore(CreateServerStore, ({ store }) =>
{
	return (
		<Container>
			<View id="create-server">
				<select name="version">
					{store.props.versions.map((v, i) => <option key={i}>{v.id}</option>)}
				</select>
			</View>
		</Container>
	);
});
