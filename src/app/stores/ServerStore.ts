import { observable } from "mobx";
import { ServerInfo, ServerSettings } from "shared/ServerInfo";
import { Store } from "./Store";

@Store.static
export class ServerStore extends Store
{
	@observable
	private serverInfo_: ServerInfo | null = null;

	@observable
	private serverSettings_: ServerSettings | null = null;

	init()
	{
		
	}

}
