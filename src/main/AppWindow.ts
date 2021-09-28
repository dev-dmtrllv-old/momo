import { BrowserWindow, BrowserWindowConstructorOptions, Event } from "electron";

export abstract class AppWindow
{
	protected readonly window: BrowserWindow;

	protected get contents() { return this.window.webContents; }

	protected abstract get loadFileName(): string;

	public constructor(options: BrowserWindowConstructorOptions)
	{
		this.window = new BrowserWindow(options);
		this.window.on("show", () => this.onShow());
		this.window.once("ready-to-show", () => this.onReady());
		this.window.on("close", (e) => this.onClose(e));
		this.window.on("closed", () => this.onClosed());
		this.load();
	}

	private load = () =>
	{
		new Promise<void>((res, rej) => 
		{
			setTimeout(() => 
			{
				this.init();
				res();
			}, 0);
		}).then(() => 
		{
			this.window.loadFile(this.loadFileName).then(() => this.onLoad());
		});
	}

	protected init = () => { };
	protected onLoad = () => { };
	protected onReady = () => { };
	protected onShow = () => { };
	protected onClose = (e: Event) => { };
	protected onClosed = () => { };
}
