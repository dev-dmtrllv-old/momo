import { action, observable } from "mobx";
import { IPC } from "shared/Ipc";
import { ServerInfo } from "shared/ServerInfo";
import { MCVersions } from "../../main/Versions";
import { Store } from "./Store";

@Store.static
export class CreateServerStore extends Store
{
	private versionsInfo_: MCVersions = {
		latest: {
			release: "",
			snapshot: ""
		},
		versions: []
	};

	@observable
	private isCreating: boolean = false;

	@observable
	private inputValues: ServerInfo = {
		name: "",
		version: ""
	};

	public get versions(): MCVersions["versions"] { return this.versionsInfo_.versions; }

	public getInputvalue<K extends keyof ServerInfo>(key: K): ServerInfo[K]
	{
		return this.inputValues[key];
	}

	@action
	private readonly setInputValues = <K extends keyof ServerInfo>(key: K, value: ServerInfo[K]) =>
	{
		this.inputValues = { ...this.inputValues, [key]: value };
	}

	public readonly onInputChange = <K extends keyof ServerInfo>(key: K, value: ServerInfo[K]) => 
	{
		if (this.inputValues[key] !== undefined)
			this.setInputValues(key, value);
	};

	protected async init()
	{
		this.versionsInfo_ = await IPC.call("get-persistent", "versions");
		this.reset();
	}

	@action
	public readonly reset = () =>
	{
		this.isCreating = false;
		this.inputValues.name = '';
		if (this.versionsInfo_.versions?.length > 0)
			this.inputValues.version = this.versionsInfo_.versions[0].id;
	}


	@action
	public readonly create = async () =>
	{
		if (this.isCreating)
			return;

		if (!this.inputValues.name || !this.inputValues.version)
		{
			console.warn("invalid input!");
		}
		else
		{
			const r = await IPC.call("create-server", JSON.stringify(this.inputValues), JSON.stringify({}));

		}
	}
}
