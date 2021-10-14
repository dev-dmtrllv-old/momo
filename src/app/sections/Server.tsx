import { ServersStore } from "app/stores/ServersStore";
import { Store } from "app/stores/Store";
import { Button, Container } from "app/views";
import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

export const Server = Store.withStore(ServersStore, ({ store }) =>
{
	const { replace } = useHistory();
	const { name } = useParams<{ name: string }>();

	const s = store.get("servers").find(s => s.name === name);
	const v = s ? s.version : "unknown";

	return (
		<Container>
			<h1>hi server {name}!</h1>
			<p>version: {v}</p>
			<Button onClick={() => { replace("/"); store.delete(name); }}>delete</Button>
			<Button onClick={() => store[store.runningServers[name]?.isRunning ? "stop" : "start"](name)}>{store.runningServers[name]?.isRunning ? "stop" : "start"}</Button>
			<h1>
				Data
			</h1>
			<div>
				{store.getOutputs(name).map((n, i) => <p key={i}>{n}</p>)}
			</div>
		</Container>
	);
});
