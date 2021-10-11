import { app } from "electron";
import { Window } from "./Window";
import { MainWindow } from "./MainWindow";
import { PromptWindow } from "./PrompWindow";

(process.env as any)["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

let mainWindow: Window;
let promptWindow: PromptWindow;

app.whenReady().then(() => 
{
	mainWindow = Window.init(MainWindow, {
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		icon: "src/assets/logo.png"
	});

	promptWindow = Window.init(PromptWindow, {
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		},
		show: false,
		icon: "src/assets/logo.png"
	});

	mainWindow.load({ target: "app" });
});

app.on("window-all-closed", () => app.quit());
