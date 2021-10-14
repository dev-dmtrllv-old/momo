import { ServersStore } from "app/stores/ServersStore";
import { Store } from "app/stores/Store";
import { Button, Container } from "app/views";
import React from "react";
import { useParams } from "react-router-dom";

export const Server = Store.withStore(ServersStore, ({ store }) =>
{
	const { name } = useParams<{ name: string }>();
	
	const s = store.get("servers").find(s => s.name === name);
	const v = s ? s.version : "unknown";

	return (
		<Container>
			<h1>hi server {name}!</h1>
			<p>version: {v}</p>
			<Button onClick={() => store.delete(name)}>delete</Button>
		</Container>
	);
});
