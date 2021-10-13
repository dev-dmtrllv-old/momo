import { WebServerStore } from "app/stores/WebServerStore";
import { Store } from "app/stores/Store";
import React from "react";

export const WebServer = Store.withStore(WebServerStore, ({ store }) =>
{
	return (
		<>
			<button onClick={store.toggleServerRunning}>{store.serverButtonText}</button>
		</>
	);
});
