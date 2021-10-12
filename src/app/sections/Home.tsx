import { ServerStore } from "app/stores/ServerStore";
import { Store } from "app/stores/Store";
import React from "react";

export const Home = Store.withStore(ServerStore, ({ store }) =>
{
	return (
		<>
			<h1>Home</h1>
			<button onClick={store.toggleServerRunning}>{store.serverButtonText}</button>
		</>
	);
});
