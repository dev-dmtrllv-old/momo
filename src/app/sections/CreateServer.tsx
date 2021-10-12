import { CreateServerStore } from "app/stores/CreateServerStore";
import { Store } from "app/stores/Store";
import { View } from "app/views";
import React from "react";

import "./styles/create-server.scss";

export const CreateServer = Store.withStore(CreateServerStore, ({ store }) =>
{
	return (
		<View id="create-server">
			Create server
			<select name="version">
				{store.versions.map((v, i) => <option key={i}>{v.id}</option>)}
			</select>
		</View>
	);
});
