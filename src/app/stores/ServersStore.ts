import { ipcRenderer } from "electron";
import { action, computed, observable } from "mobx";
import { IPC } from "shared/Ipc";
import { getServerProcChannel, ServersProps } from "shared/ServerInfo";
import { PersistenStore } from "./PersistenStore";
import { Store } from "./Store";

@Store.static
export class ServersStore extends PersistenStore<ServersProps>
{
	@observable
	private runningServers_: ServerProcInfo = {}

	protected get persistentName(): string
	{
		return "servers";
	}

	public readonly delete = async (name: string): Promise<boolean> =>
	{
		const s = this.get("servers").find(s => s.name === name);

		if (!s)
			return false;

		const r = await IPC.call("delete-server", name);

		return r.success;
	}

	protected async onLoad()
	{
		this.runningServers_ = await IPC.call("get-running-processes");
	}

	@computed
	get runningServers() { return this.runningServers_; }

	@action
	private setRunningServers(servers: ServerProcInfo) { this.runningServers_ = servers; }

	@action
	private addOutput(name: string, data: string)
	{
		console.log("output")
		this.runningServers_ = {
			...this.runningServers_,
			[name]:
			{
				...this.runningServers_[name],
				output: [...this.runningServers_[name].output, data]
			}
		};
	}

	@action
	private addError(name: string, data: string)
	{
		console.log("error")
		this.runningServers_ = {
			...this.runningServers_,
			[name]:
			{
				...this.runningServers_[name],
				errors: [...this.runningServers_[name].errors, data]
			}
		};
	}

	public getOutputs(name: string)
	{
		return this.runningServers_[name] ? [...this.runningServers_[name].output] : [];
	}

	public getErrors(name: string)
	{
		return this.runningServers_[name]?.errors || [];
	}

	@action
	private readonly stopProcess = (name: string) =>
	{
		const s = { ...this.runningServers_ };
		s[name].isRunning = false;
		this.setRunningServers(s);
	}

	public readonly start = async (name: string) =>
	{
		const s = { ...this.runningServers_ };

		if (!s[name])
		{
			s[name] = {
				isRunning: false,
				output: [],
				errors: [],
			};

			ipcRenderer.on(getServerProcChannel(name, "out"), (e, data) => this.addOutput(name, data));
			ipcRenderer.on(getServerProcChannel(name, "error"), (e, data) => this.addError(name, data));
			ipcRenderer.on(getServerProcChannel(name, "exit"), (e, data) => 
			{
				this.addOutput(name, "Exited!");
				this.stopProcess(name);
				console.log("exit");
			});
		}

		if (!s[name].isRunning)
		{
			s[name].isRunning = true;
			s[name].errors = [];
			s[name].output = [];
			this.setRunningServers(s);
		}
		await IPC.call("start-server", name);
		this.addOutput(name, "Starting server...");
	}

	public readonly stop = async (name: string) =>
	{
		if (this.runningServers_[name]?.isRunning)
		{
			await IPC.call("stop-server", name);
			this.stopProcess(name);
		}
	}

}

type ServerProcInfo = {
	[key: string]:
	{
		output: string[];
		errors: string[];
		isRunning: boolean;
	}
};
