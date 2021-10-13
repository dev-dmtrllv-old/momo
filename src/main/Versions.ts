import { Persistent } from "./Persistent";
import { utils } from "../utils";

export class Versions extends Persistent<MCVersions>
{
	protected async defaultProps(): Promise<MCVersions>
	{
		try
		{
			return getVersions();
		}
		catch(e)
		{
			return {
				latest: {
					release: "",
					snapshot: "",
				},
				versions: []
			};
		}
	}
}

export const getVersions = async (): Promise<MCVersions> =>
{
	const data = await utils.http.get("https://launchermeta.mojang.com/mc/game/version_manifest.json");
	return JSON.parse(data);
};

export type MCVersions = {
	latest: {
		snapshot: string;
		release: string;
	};
	versions: {
		id: string;
		type: "release" | "snapshot" | "old_beta" | "old_alpha";
		url: string;
		time: string;
		releaseTime: string;
	}[];
};
