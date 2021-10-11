import { ipcMain } from "electron";
import { Window } from "./Window";

export class PromptWindow extends Window
{
	public prompt(options: PromptOptions)
	{
		return new Promise<any>(async (res, rej) => 
		{
			await this.load({ target: "prompt", ...options });
			
			ipcMain.once("response", (event, arg) => {
				this.window.close();
				res(arg);
			});
		});
	}

	protected onReady = () =>
	{
		this.window.show();
	}
}

type PromptButton = {
	text: string;
	value: any;
};

type PromptOptions = {
	question: string;
	buttons: PromptButton[];
};
