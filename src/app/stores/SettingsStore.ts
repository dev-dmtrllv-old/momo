import { Store } from "./Store";
import { SettingsProps } from "../../main/Settings";
import { PersistenStore } from "./PersistenStore";

@Store.static
export class SettingsStore extends PersistenStore<SettingsProps>
{
	protected get persistentName(): string { return "settings"; }
	
	onLoad(props: SettingsProps)
	{
		console.log(props);
	}
}
