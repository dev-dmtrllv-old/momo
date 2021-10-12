import { Event, Menu, Tray } from "electron";
import { Window } from "./Window";
import fs from "fs";
import { PromptWindow } from "./PrompWindow";
import { Assets } from "./Assets";

export class MainWindow extends Window
{
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
		{ label: "Hide", type: "normal", click: () => this.hide() },
		{ type: "separator" },
		{ label: "Quit", type: "normal", click: () => { this.close(); } }
	];

	private tray_: Tray | null = null;
	private canQuit_: boolean = false;

	private get tray(): Tray
	{
		if (this.tray_ == null)
			throw new Error("tray is not initialized!");
		return this.tray_;
	}

	private async close()
	{
		const promptWindow = Window.get(PromptWindow);
		const response = await promptWindow.prompt({
			question: "Are you sure you want to quit?",
			buttons: [
				{
					text: "Cancel",
					value: false
				},
				{
					text: "Quit",
					value: true
				},
			]
		});
		
		if (response)
		{
			this.canQuit_ = true;
			this.window.close();
		}
	}

	protected init = () =>
	{
		this.tray_ = new Tray(Assets.resolvePath("logo.png"));
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
		this.window.maximize();
		this.window.webContents.openDevTools();
		this.window.show();
	}

	protected onLoad = () =>
	{

	}

	protected onClose = (e: Event) =>
	{
		if (!this.canQuit_)
		{
			e.preventDefault();
			this.hide();
		}
	}

	protected onClosed = () =>
	{
		this.tray.destroy();
	}
}
