import { ServersProps } from "shared/ServerInfo";
import { PersistenStore } from "./PersistenStore";

export class ServerListStore extends PersistenStore<ServersProps>
{
	protected get persistentName(): string
	{
		return "servers";
	}
}
