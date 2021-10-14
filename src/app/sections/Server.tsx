import { ServersStore } from "app/stores/ServersStore";
import { Store } from "app/stores/Store";
import { Button, Container, Input } from "app/views";
import React from "react";
import { useHistory, useParams } from "react-router-dom";

export const Server = Store.withStore(ServersStore, ({ store }) =>
{
	const [val, setVal] = React.useState("");

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
				<Input type="text" onChange={(e) => setVal(e.target.value)} value={val} placeholder="" name="command" onKeyDown={(e) => { if(e.code === "Enter") { store.sendCommand(name, val); setVal(""); } }}/>
			</div>
		</Container>
	);
});
