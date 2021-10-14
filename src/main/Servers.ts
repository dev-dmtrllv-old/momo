import { Persistent } from "./Persistent";
import { ServerInfo, ServerSettings, ServersProps } from "../shared/ServerInfo";
import { Versions } from "./Versions";
import { Settings } from "./Settings";
import { utils } from "../utils";
import path from "path";
import fs from "fs";

export class Servers extends Persistent<ServersProps>
{
	protected defaultProps(): ServersProps
	{
		return { servers: [] };
	}

	public get size() { return this.props.servers.length; }

	public async create(info: ServerInfo, settings?: Partial<ServerSettings>): Promise<CreateServerInfo>
	{
		const versions = Persistent.get<Versions>(Versions).get("versions");
		const foundItem = versions.find(v => v.id === info.version);
		
		if(!foundItem)
			return { error: "invalid version!", success: false };
		
		const data = await utils.http.get(foundItem.url);
		
		const downloadInfo: DownloadInfo = JSON.parse(data).downloads.server;
		const serversPath = Persistent.get<Settings>(Settings).get("serversPath");

		if(!fs.existsSync(serversPath))
			fs.mkdirSync(serversPath);

		const serverPath = path.resolve(serversPath, info.name);
		const serverJarPath = path.join(serverPath, "server.jar");

		if(fs.existsSync(serverPath))
		{
			if(fs.existsSync(serverJarPath))
				return { error: `server ${info.name} already exists!`, success: false };
			else
				return { error: `folder not empty!`, success: false };
		}	
		else
		{
			fs.mkdirSync(serverPath);
		}
		
		await utils.http.download(serverJarPath, downloadInfo.url);

		this.update("servers", s => [...s, info]);

		return { success: true };
	}

	public async delete(name: string): Promise<DeleteServerInfo>
	{
		console.log("delete", name);
		return { success: true };
	}
}

export type CreateServerInfo = {
	error?: string;
	success: boolean;
};

export type DeleteServerInfo = {
	error?: string;
	success: boolean;
};

type DownloadInfo = {
	sha1: string;
	size: number;
	url: string;
};
