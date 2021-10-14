import { action, computed, observable } from "mobx";
import { IPC } from "shared/Ipc";
import { defaultServerSettings, ServerInfo, ServerSettings } from "shared/ServerInfo";
import { MCVersions, VersionsFiler, VersionType } from "../../main/Versions";
import { Store } from "./Store";

@Store.static
export class CreateServerStore extends Store
{
	@action
	public setVersionFilterType(name: string, selected: boolean)
	{
		(this.versionTypes_ as any)[name] = selected;
	}

	public static readonly VERSION_TYPES: Readonly<["release", "snapshot", "old_alpha", "old_beta"]> = ["release", "snapshot", "old_alpha", "old_beta"];

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
	private inputValues: ServerInfo & ServerSettings = {
		name: "",
		version: "",
		color: "#ffa42c",
		...defaultServerSettings
	};

	@observable
	private versionTypes_: VersionsFiler = {
		release: true,
		snapshot: false,
		old_beta: false,
		old_alpha: false,
	};

	@computed
	public get versions(): MCVersions["versions"] { return this.versionsInfo_.versions.filter(v => this.isVersionTypeSelected(v.type)); }

	public getInputvalue<K extends keyof ServerInfo>(key: K): ServerInfo[K]
	{
		return this.inputValues[key];
	}

	public isVersionTypeSelected(type: VersionType): boolean | undefined
	{
		return this.versionTypes_[type];
	}

	public getInitials()
	{
		const parts = this.inputValues.name.split(" ");
		if(parts[1])
			return [parts[0][0] || "", parts[1][0] || ""];
		return [parts[0][0] || ""];
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
			const { name, color, version, ...settings } = this.inputValues;
			const r = await IPC.call("create-server", JSON.stringify({ name, version, color }), JSON.stringify(settings));
			console.log(r);
		}
	}
}
