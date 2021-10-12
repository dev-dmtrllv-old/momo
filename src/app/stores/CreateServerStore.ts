import { IPC } from "shared/Ipc";
import { MCVersions } from "../../main/Versions";
import { Store } from "./Store";

@Store.static
export class CreateServerStore extends Store
{
	private versionsInfo_!: MCVersions;

	public async init()
	{
		this.versionsInfo_ = JSON.parse(await IPC.call("get-persistent", "versions"));
	}

	public get versions() { return this.versionsInfo_.versions; }
}
