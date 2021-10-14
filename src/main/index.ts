import { app } from "electron";
import { Window } from "./Window";
import { MainWindow } from "./MainWindow";
import { PromptWindow } from "./PrompWindow";
import { Assets } from "./Assets";
import { WebServer } from "./server/WebServer";
import { IPC } from "../shared/Ipc";
import { Persistent } from "./Persistent";
import path from "path";
import { Settings } from "./Settings";
import { Versions } from "./Versions";
import { Servers } from "./Servers";
import { ServerProcess } from "./ServerProcess";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

let mainWindow: MainWindow;
let promptWindow: PromptWindow;

app.whenReady().then(async () => 
{
	app.setPath("appData", path.resolve(app.getPath("appData"), "momo"));
	
	Persistent.register("settings", Settings);
	Persistent.register("versions", Versions);
	Persistent.register("servers", Servers);

	await Persistent.init(app.getPath("appData"));

	IPC.initMain({
		"start-web-server": () => WebServer.get().start(),
		"stop-web-server": () => WebServer.get().stop(),
		"is-web-server-running": () => WebServer.get().isRunning(),
		"get-persistent": (name): any => (Persistent.get(name)?.data || {}),
		"update-persistent": (name, key, val) => Persistent.get(Servers).set(key, val),
		"create-server": (info: any, settings: any) => Persistent.get(Servers).create(info, settings),
		"delete-server": (name) => Persistent.get(Servers).delete(name),
		"start-server": (name: string) => Persistent.get(Servers).start(name),
		"get-running-processes": () => ServerProcess.getProcesses(),
		"stop-server": (name: string) => Persistent.get(Servers).stop(name),
		"send-server-command": (name: string, command: string) => ServerProcess.get(name).sendCommand(command)
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

const terminate = () =>
{
	console.log("app will quit");
	ServerProcess.killAll();
}


app.on("window-all-closed", () => app.quit());

app.on("will-quit", terminate);
app.on("quit", terminate);
process.on("SIGTERM", terminate);
process.on("exit", terminate);
process.on("beforeExit", terminate);
process.on("disconnect", terminate);
// process.on("SIGKILL", terminate);

