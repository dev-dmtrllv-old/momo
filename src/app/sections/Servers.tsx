import { ServersStore } from "app/stores/ServersStore";
import { Store } from "app/stores/Store";
import React from "react";

export const Servers = Store.withStore(ServersStore, ({ store }) =>
{
	return (
		<>
			hi
		</>
	);
});
