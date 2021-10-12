import { Persistent } from "./Persistent";
import { app } from "electron"; 
import path from "path";

export class Settings extends Persistent<SettingsProps>
{
	protected defaultProps(): SettingsProps
	{
		return {
			serversPath: path.resolve(app.getPath("appData"), "servers"),
		};
	}
}

export type SettingsProps = {
	serversPath: string;
};
