import { ServerStore } from "app/stores/ServerStore";
import { Store } from "app/stores/Store";
import React from "react";

export const Home = Store.withStore(ServerStore, ({ store }) =>
{
	return (
		<>
			<h2>hiii</h2>
		</>
	);
});
