import { Event, Menu, MenuItem, Tray } from "electron";
import { AppWindow } from "./AppWindow";
import fs from "fs";

export class MainWindow extends AppWindow
{
	protected get loadFileName(): string
	{
		return "./dist/app/index.html";
	}

	private hide = () =>
	{
		const i = this.trayTemplate[0];
		i.label = "Show";
		i.click = () => this.show();
		this.tray.setContextMenu(Menu.buildFromTemplate(this.trayTemplate));
		this.window.hide();
	}

	private show = () =>
	{
		const i = this.trayTemplate[0];
		i.label = "Hide";
		i.click = () => this.hide();
		this.tray.setContextMenu(Menu.buildFromTemplate(this.trayTemplate));
		this.window.show();
	}

	private trayTemplate: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
		{ label: "Hide", click: () => this.hide() },
		{ type: "separator" },
		{ label: "Quit", type: "normal", click: () => { } }
	];

	private tray_: Tray | null = null;

	private get tray(): Tray
	{
		if (this.tray_ == null)
			throw new Error("tray is not initialized!");
		return this.tray_;
	}

	protected init = () =>
	{
		console.log("on init");

		this.tray_ = new Tray("src/assets/logo.png");
		this.tray.setContextMenu(Menu.buildFromTemplate(this.trayTemplate));

		this.window.setMenu(null);

		let to: NodeJS.Timeout;

		const onChange = () => 
		{
			clearTimeout(to);
			to = setTimeout(() => 
			{
				this.window.webContents.reload();
			}, 350);
		};

		const watch = (dir: string = "") =>
		{
			if (fs.existsSync(`./dist/app${dir}`))
				fs.watch(`./dist/app${dir}`, {}, onChange);
		}

		watch();
		watch("js");
		watch("img");
	}

	protected onReady = () =>
	{
		console.log("on ready");
		this.window.maximize();
		this.window.webContents.openDevTools();
		this.window.show();
	}

	protected onLoad = () =>
	{
		console.log("on load");
	}

	protected onClose = (e: Event) =>
	{
		console.log("on close");
		e.preventDefault();
		this.hide();
	}

	protected onClosed = () =>
	{
		console.log("on closed");
		this.tray.destroy();
	}
}
