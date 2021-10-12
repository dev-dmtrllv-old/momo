import { MCVersions } from "../../main/Versions";
import { PersistenStore } from "./PersistenStore";
import { Store } from "./Store";

@Store.static
export class CreateServerStore extends PersistenStore<MCVersions>
{
	protected get persistentName(): string
	{
		return "versions";
	}
}
