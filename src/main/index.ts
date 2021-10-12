import { app } from "electron";
import { Window } from "./Window";
import { MainWindow } from "./MainWindow";
import { PromptWindow } from "./PrompWindow";
import { Assets } from "./Assets";
import { Server } from "./server/Server";
import { IPC } from "../shared/Ipc";
import { Persistent } from "./Persistent";
import path from "path";
import { Settings } from "./Settings";
import { Versions } from "./Versions";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

let mainWindow: MainWindow;
let promptWindow: PromptWindow;

app.whenReady().then(() => 
{
	app.setPath("appData", path.resolve(app.getPath("appData"), "momo"));
	
	Persistent.register("settings", Settings);
	Persistent.register("versions", Versions);

	Persistent.init(app.getPath("appData"));

	IPC.initMain({
		"start-server": () => Server.get().start(),
		"stop-server": () => Server.get().stop(),
		"is-server-running": () => Server.get().isRunning(),
		"get-persistent": (name) => Persistent.get(name).serialize(),
		"update-persistent": (name, key, val) => Persistent.get(name).set(key, val),
	});
	
	const iconPath = Assets.resolvePath("logo.png");

	mainWindow = Window.init(MainWindow, {
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
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
