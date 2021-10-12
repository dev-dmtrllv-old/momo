import { app } from "electron";
import { Window } from "./Window";
import { MainWindow } from "./MainWindow";
import { PromptWindow } from "./PrompWindow";
import { Assets } from "./assets";
import { Server } from "./server/Server";
import { IPC } from "./Ipc";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

let mainWindow: MainWindow;
let promptWindow: PromptWindow;


app.whenReady().then(() => 
{
	IPC.initMain({
		"start-server": () => Server.get().start(),
		"stop-server": () => Server.get().stop(),
		"is-server-running": () => Server.get().isRunning()
	});
	
	const iconPath = Assets.resolvePath("logo.png");

	mainWindow = Window.init(MainWindow, {
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		icon: iconPath
	});

	promptWindow = Window.init(PromptWindow, {
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		icon: iconPath
	});

	mainWindow.load("App");

});

app.on("window-all-closed", () => app.quit());
