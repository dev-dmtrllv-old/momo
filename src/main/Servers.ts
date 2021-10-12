import { Persistent } from "./Persistent";
import { ServerInfo, ServersProps } from "../shared/ServerInfo";

export class Servers extends Persistent<ServersProps>
{
	protected defaultProps(): ServersProps
	{
		return { servers: [] };
	}
}
