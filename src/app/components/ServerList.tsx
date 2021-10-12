import { ServerListStore } from "app/stores/ServerListStore";
import { Store } from "app/stores/Store";
import { View } from "app/views";
import React from "react";

export const ServerList = Store.withStore(ServerListStore, () =>
{
	return (
		<View position="absolute" theme="secundary" fill>
			Server List
		</View>
	);
});
