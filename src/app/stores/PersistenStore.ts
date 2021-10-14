import { IPC } from "shared/Ipc";
import { action, computed, makeObservable, observable } from "mobx";
import { Store } from "./Store";
import { ipcRenderer } from "electron";

export abstract class PersistenStore<Props> extends Store
{
	protected abstract get persistentName(): string;

	@observable
	private props_!: Props;

	@computed
	public get props() { return this.props_; }

	@computed
	public get keys() { return Object.keys(this.props_) as (keyof Props)[]; };

	protected async init()
	{
		const data = await IPC.call("get-persistent", this.persistentName);

		ipcRenderer.on(`persistent-${this.persistentName}-updated`, (e, key, val) => this.setVal(key, JSON.parse(val), true));

		if (!data)
			throw new Error("Could not get data!");
		
		this.props_ = data;

		this.onLoad(this.props);
		makeObservable(this);
	}

	protected onLoad(props: Props): void { }

	@action
	private readonly setVal = async <K extends keyof Props>(key: K, val: Props[K], fromIpcUpdate: boolean = false) =>
	{
		const props = { ...this.props, [key]: val };
		this.props_ = props;
		if(!fromIpcUpdate)
			await IPC.call("update-persistent", this.persistentName, key, JSON.stringify(val));
	}

	public readonly set = async <K extends keyof Props>(key: K, val: Props[K]) =>
	{
		if (this.props[key] !== val)
			await this.setVal(key, val);
	}

	public readonly get = <K extends keyof Props>(key: K): Props[K] => this.props[key];

	public readonly update = async <K extends keyof Props>(key: K, updater: (val: Props[K]) => Props[K]) => this.set(key, updater(this.get(key)));
}
