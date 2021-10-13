import { WebServerStore } from "app/stores/WebServerStore";
import { Store } from "app/stores/Store";
import React from "react";

export const Home = Store.withStore(WebServerStore, ({ store }) =>
{
	return (
		<>
			<h2>hiii</h2>
		</>
	);
});
