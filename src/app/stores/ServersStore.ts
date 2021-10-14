import { observable } from "mobx";
import { IPC } from "shared/Ipc";
import { ServerInfo, ServerSettings, ServersProps } from "shared/ServerInfo";
import { PersistenStore } from "./PersistenStore";
import { Store } from "./Store";

@Store.static
export class ServersStore extends PersistenStore<ServersProps>
{
	protected get persistentName(): string
	{
		return "servers";
	}
	
	public readonly delete = async (name: string): Promise<boolean> =>
	{
		const s = this.get("servers").find(s => s.name === name);
		
		if(!s)
			return false;
	
		const r = await IPC.call("delete-server", name);
		
		return r.success;
	}
}
