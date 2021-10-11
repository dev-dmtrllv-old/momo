import path from "path";
import { isDev } from "./env";

export class Assets
{
	public static resolvePath(...parts: string[])
	{
		if(isDev())
			return path.join("src/assets", ...parts);
		return path.resolve(__dirname, "assets", ...parts);
	}
}
