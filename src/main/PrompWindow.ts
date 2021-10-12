import { ipcMain } from "electron";
import { Window } from "./Window";

export class PromptWindow extends Window
{
	private resolver: ((value: any) => void) | null = null;

	public isOpen() { return this.resolver !== null; }

	public prompt(options: PromptOptions, size: { width: number, height: number } = { width: 640, height: 480 })
	{
		return new Promise<any>(async (res, rej) => 
		{
			if (this.resolver)
			{
				rej("prompt is already open!");
			}
			else
			{
				this.resolver = res;
				
				await this.load("Prompt", options);
				
				this.window.setSize(size.width, size.height);

				ipcMain.once("prompt-response", (event, arg) =>
				{
					this.resolver = null;
					this.window.close();
					res(arg);
				});
				ipcMain.once("prompt-ready", (event, width, height) => 
				{
					if(width && height)
						this.window.setSize(width, height);
					this.window.show();
				});
			}
		});
	}

	protected onClose = () =>
	{
		if(this.resolver)
			this.resolver(false);
		this.resolver = null;
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
