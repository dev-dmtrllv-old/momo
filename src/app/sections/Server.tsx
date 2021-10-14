import { ServerStore } from "app/stores/ServerStore";
import { Store } from "app/stores/Store";
import React from "react";

export const Server = Store.withStore(ServerStore, ({ store }) =>
{
	return (
		<>
			hi
		</>
	);
});
