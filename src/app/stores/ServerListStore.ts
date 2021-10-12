import { ServersProps } from "shared/ServerInfo";
import { PersistenStore } from "./PersistenStore";
import { Store } from "./Store";

@Store.static
export class ServerListStore extends PersistenStore<ServersProps>
{
	protected get persistentName(): string
	{
		return "servers";
	}
}
