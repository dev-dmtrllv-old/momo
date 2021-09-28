import { app } from "electron";
import { AppWindow } from "./AppWindow";
import { MainWindow } from "./MainWindow";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;


let mainWindow: AppWindow;

app.whenReady().then(() => 
{
	mainWindow = new MainWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
	});
});
