import { BrowserWindow, BrowserWindowConstructorOptions, Event } from "electron";
import { AppInfo } from "./AppInfo";
import { isDev } from "./env";

export abstract class Window
{
	private static instances: Window[] = [];

	public static get<T extends Window>(type: WindowType<T>): T
	{
		const w = this.instances.find(c => c.constructor == type) as T;
		if (!w)
			throw new Error(`${type.name} is not initialized yet!`);
		return w;
	}

	public static init<T extends Window>(type: WindowType<T>, options: BrowserWindowConstructorOptions): T
	{
		try
		{
			return this.get(type);
		}
		catch (e)
		{
			const w = new type(options);
			this.instances.push(w);
			return w;
		}
	}

	private isLoaded_: boolean = false;

	protected readonly window: BrowserWindow;

	protected get contents() { return this.window.webContents; }

	protected get loadFileName(): string
	{
		return isDev() ? "./dist/app/index.html" : "./app/index.html";
	}

	public constructor(options: BrowserWindowConstructorOptions)
	{
		this.window = new BrowserWindow(options);
		this.window.on("show", () => this.onShow());
		this.window.once("ready-to-show", () => this.onReady());
		this.window.on("close", (e) => this.close_(e));
		this.window.on("closed", () => this.onClosed());
	}

	private readonly close_ = (e: Event) =>
	{
		this.onClose(e);
		this.isLoaded_ = e.defaultPrevented;
	}

	public readonly load = (appName: string, data?: any) =>
	{
		if (!this.isLoaded_)
		{
			this.isLoaded_ = true;
			return new Promise<void>((res) => 
			{
				setTimeout(() => 
				{
					this.init();
					res();
				}, 0);
			}).then(() => 
			{
				this.window.loadFile(this.loadFileName, { search: JSON.stringify({ data: { path: appName, data } }) }).then(() => this.onLoad());
			});
		}
		return new Promise<void>((res) => res());
	}

	protected init = () => { };
	protected onLoad = () => { };
	protected onReady = () => { };
	protected onShow = () => { };
	protected onClose = (e: Event) => { };
	protected onClosed = () => { };
}

type WindowType<T extends Window> = new (options: BrowserWindowConstructorOptions) => T;
