import { Persistent } from "./Persistent";
import https from "https";

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

export const getVersions = (): Promise<MCVersions> => new Promise(async (res, rej) =>
{
	https.get("https://launchermeta.mojang.com/mc/game/version_manifest.json", (response) => 
	{
		let data: string = "";
		response.on("data", (d) => data += d);
		response.on("end", () => res(JSON.parse(data)));
		response.on("error", rej);
	});
});

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
