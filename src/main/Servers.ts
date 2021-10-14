import { Persistent } from "./Persistent";
import { defaultServerSettings, ServerInfo, ServerSettings, ServersProps } from "../shared/ServerInfo";
import { Versions } from "./Versions";
import { Settings } from "./Settings";
import { ServerProcess } from "./ServerProcess";
import { utils } from "../utils";
import { ServerProperties } from "./ServerProperties";
import path from "path";

const fs = utils.fs;

export class Servers extends Persistent<ServersProps>
{
	protected defaultProps(): ServersProps
	{
		return { servers: [] };
	}

	public get size() { return this.props.servers.length; }

	public async create(info: ServerInfo, settings: Partial<ServerSettings> = defaultServerSettings): Promise<CreateServerInfo>
	{
		const versions = Persistent.get<Versions>(Versions).get("versions");
		const foundItem = versions.find(v => v.id === info.version);
		
		if(!foundItem)
			return { error: "invalid version!", success: false };
		
		const data = await utils.http.get(foundItem.url);
		
		const downloadInfo: DownloadInfo = JSON.parse(data).downloads.server;
		const serversPath = Persistent.get<Settings>(Settings).get("serversPath");

		if(!await utils.fs.exists(serversPath))
			await fs.mkdir(serversPath);

		const serverPath = path.resolve(serversPath, info.name);
		
		const resolve = (...parts: string[]) => path.join(serverPath, ...parts); 
		
		const serverJarPath = resolve("server.jar");

		if(await fs.exists(serverPath))
		{
			if(await fs.exists(serverJarPath))
				return { error: `server ${info.name} already exists!`, success: false };
			else
				return { error: `folder not empty!`, success: false };
		}	
		else
		{
			await fs.mkdir(serverPath);
		}
		
		await utils.http.download(serverJarPath, downloadInfo.url);

		const serverProperties = new ServerProperties(resolve("server.properties"));
		await serverProperties.setProps(settings);

		await fs.writeFile(resolve("eula.txt"), "eula=true", "utf-8");

		this.update("servers", s => [...s, info]);

		return { success: true };
	}

	public async start(name: string)
	{
		const p = ServerProcess.get(name);
		if(!p.isRunning)
			p.start();
	}

	public async stop(name: string)
	{
		const p = ServerProcess.get(name);
		if(p.isRunning)
			p.stop();
	}

	public async delete(name: string): Promise<DeleteServerInfo>
	{
		let servers = [...this.get("servers")];
		let index = -1;

		const s = servers.find((s, i) => 
		{
			if(s.name === name)
			{
				index = i;
				return true;
			}
			return false;
		});

		if(!s || index < 0)
			return { success: false, error: "missing from servers.json!" };

		const serversPath = Persistent.get<Settings>(Settings).get("serversPath");
		const p = path.join(serversPath, name);

		servers.splice(index, 1);
		
		this.set("servers", servers);

		if(await fs.exists(p))
		{
			await fs.rmdir(p);
			return { success: true }
		}
		else
		{
			return { success: false, error: `Could not find folder ${p}!` };
		}
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
