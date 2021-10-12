import { Store } from "./Store";
import { action, computed, observable } from "mobx";
import { IPC } from "shared/Ipc";

@Store.static
export class ServerStore extends Store
{
	@observable
	private isServerRunning: boolean = false;

	@observable
	private isServerStarting: boolean = false;

	@observable
	private isServerStopping: boolean = false;

	@computed
	public get serverButtonText() 
	{
		if(this.isServerStopping)
			return "Server is starting...";

		if(this.isServerStarting)
			return "Server is starting...";

		if(this.isServerRunning)
			return "Stop Server";
			
		return "Start server";
	}

	protected async init()
	{
		this.isServerRunning = await IPC.call("is-server-running");
	}

	@action private setState = (running: boolean, starting: boolean, stopping: boolean) =>
	{
		this.isServerRunning = running;
		this.isServerStarting = starting;
		this.isServerStopping = stopping;
	};

	@action
	public readonly toggleServerRunning = async () =>
	{
		if(!this.isServerStarting && !this.isServerStopping)
		{
			if(this.isServerRunning)
			{
				this.setState(true, false, true);
				await IPC.call("stop-server");
				this.setState(false, false, false);
			}
			else
			{
				this.setState(false, true, false);
				await IPC.call("start-server");
				this.setState(true, false, false);
			}
		}
	}
}
