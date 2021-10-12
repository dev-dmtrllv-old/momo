// import { Server } from "./server/Server";

const isMain = !(process && process.type === 'renderer')

export class IPC
{
	private static readonly Handler = class Handler
	{
		public constructor(public type: HandlerType, public handler: HandlerCallback = () => { }) { };
	};

	public static readonly GET_IPC_ID_STRING = "get-ipc-msg-id";

	private static handlers_ = {
		"start-server": new IPC.Handler("invoke"),
		"stop-server": new IPC.Handler("invoke"),
		"is-server-running": new IPC.Handler("msg")
	};

	private static get handlers() { return this.handlers_ as IpcHandlers; }

	private static isInitialized_ = false;

	public static initMain(initHandlers: Partial<{ [K in keyof typeof IPC.handlers_]: HandlerCallback; }>)
	{
		if (isMain)
		{
			if (!this.isInitialized_)
			{
				const ipcMain = require("electron").ipcMain;
				this.isInitialized_ = true;

				ipcMain.handle(this.GET_IPC_ID_STRING, () => this.idCounter_++);

				for (const k in this.handlers)
				{
					const channel = String(k);
					let { type, handler } = (this.handlers as any)[k];
					
					if((initHandlers as any)[channel])
						handler = (initHandlers as any)[channel];

					switch (type)
					{
						case "invoke":
							ipcMain.handle(channel, async (e, ...args) => await handler(...args));
							break;
						case "async-msg":
							ipcMain.on(channel, async (e, id, ...args) => 
							{
								const data = await handler(...args);
								e.reply(this.channelToResponseString(channel, id), data);
							});
							break;
						case "msg":
							ipcMain.on(channel, async (e, ...args) => { e.returnValue = (await handler(...args)); });
							break;
					}
				}
			}
		}
	}

	private static idCounter_ = 0;

	private static channelToResponseString = (channel: string, id: number) => `${channel}-response-#${id}`;

	public static readonly call = (key: keyof typeof IPC.handlers_, ...args: any[]) => new Promise<any>(async (resolve, reject) => 
	{
		if(!(IPC.handlers as any)[key])
			reject(`${key} not found!`);
			
		const { type, handler } = (IPC.handlers as any)[key];

		const channel = String(key);

		if (isMain)
		{
			resolve(handler(...args));
		}
		else
		{
			const ipcRenderer = require("electron").ipcRenderer;
			switch (type)
			{
				case "invoke":
					console.log("invoke");
					ipcRenderer.invoke(channel, ...args).then(resolve).catch(reject);
					break;
				case "msg":
					resolve(ipcRenderer.sendSync(channel, ...args));
					break;
				case "async-msg":
					{
						const id = await ipcRenderer.invoke(this.GET_IPC_ID_STRING);
						ipcRenderer.send(channel, id, ...args);
						ipcRenderer.once(this.channelToResponseString(channel, id), (event, ...args) => resolve(args));
					}
					break;
			}
		}
	});

	public static setHandler(channel: keyof typeof this.handlers_, handler: (...args: any[]) => any)
	{
		this.handlers[channel].handler = handler;
	}
}

type HandlerType = "invoke" | "msg" | "async-msg";
type HandlerCallback = (...args: any[]) => any;

export type IpcHandlers = {
	[name: string]: {
		type: HandlerType;
		handler: HandlerCallback;
	};
};
