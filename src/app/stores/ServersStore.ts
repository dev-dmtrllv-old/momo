import { observable } from "mobx";
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
	

}
