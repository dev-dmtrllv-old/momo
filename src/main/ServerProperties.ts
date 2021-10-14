import { defaultServerSettings, ServerSettings } from "../shared/ServerInfo";
import { utils } from "../utils";

export class ServerProperties
{
	public readonly path: string;

	private props_: Partial<ServerSettings> = {};

	public constructor(path: string)
	{
		this.path = path;
	}

	private async write()
	{
		let buf = "";
		for(const k in this.props_)
			buf += `${k}=${String((this.props_ as any)[k])}\r\n`;
		await utils.fs.writeFile(this.path, buf, "utf-8");
	}

	public async setProps(props: Partial<ServerSettings>)
	{
		props = { ...defaultServerSettings, ...props };
		this.props_ = props;
		await this.write();
	}
}
