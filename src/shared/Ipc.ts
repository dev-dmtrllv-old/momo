import { isMain } from "./env";
import type { CreateServerInfo, DeleteServerInfo } from "../main/Servers";

class IpcHandler<T extends HandlerCallback = HandlerCallback>
{
	public type!: HandlerType;
	public handler!: T;

	public constructor(type: HandlerType, handler?: T)
	{
		this.type = type;
		this.handler = handler!;
	};
}

export class IPC
{
	private static readonly Handler = IpcHandler;

	public static readonly GET_IPC_ID_STRING = "get-ipc-msg-id";

	private static handlers_ = {
		"start-web-server": new IPC.Handler<() => Promise<[string, number]>>("invoke"),
		"stop-web-server": new IPC.Handler<() => Promise<void>>("invoke"),
		"is-web-server-running": new IPC.Handler<() => boolean>("msg"),
		"update-persistent": new IPC.Handler("async-msg"),
		"get-persistent": new IPC.Handler<(key: string) => any>("async-msg"),
		"create-server": new IPC.Handler<(info: string, settings: string) => Promise<CreateServerInfo>>("invoke"),
		"delete-server": new IPC.Handler<(name: string) => Promise<DeleteServerInfo>>("invoke"),
	};

	private static get handlers() { return this.handlers_ as IpcHandlers; }

	private static isInitialized_ = false;

	public static initMain(initHandlers: { [K in keyof typeof IPC.handlers_]: (typeof IPC)["handlers_"][K]["handler"]; })
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

					if ((initHandlers as any)[channel])
						handler = (initHandlers as any)[channel];

					const parseArgs = (args: any[]): any[] => args.map(arg => JSON.parse(arg));

					switch (type)
					{
						case "invoke":
							ipcMain.handle(channel, async (e, ...args) => { console.log(...parseArgs(args)); return await handler(...parseArgs(args)) });
							break;
						case "async-msg":
							ipcMain.on(channel, async (e, id, ...args) => 
							{
								{ console.log(...parseArgs(args)); }
								const data = await handler(...parseArgs(args));
								e.reply(this.channelToResponseString(channel, id), data);
							});
							break;
						case "msg":
							ipcMain.on(channel, async (e, ...args) => { e.returnValue = (await handler(...parseArgs(args))); });
							break;
					}
				}

				const k = Object.keys(initHandlers);
				for (const key in IPC.handlers_)
				{
					if (!k.includes(key))
						console.warn(`missing IPC method for ${key}!`);
				}

			}
		}
	}

	private static idCounter_ = 0;

	private static channelToResponseString = (channel: string, id: number) => `${channel}-response-#${id}`;

	public static readonly call = <K extends keyof typeof IPC.handlers_>(key: K, ...args: IpcHandlerArgs<typeof IPC.handlers_[K]["handler"]>) => new Promise<IpcHandlerReturnType<typeof IPC.handlers_[K]["handler"]>>(async (resolve, reject) => 
	{
		if (!(IPC.handlers as any)[key])
			reject(`${key} not found!`);

		const { type, handler } = (IPC.handlers as any)[key];

		const channel = String(key);

		if (isMain)
		{
			resolve(handler(...args));
		}
		else
		{
			const parseArgs = (args: any[]): any[] => args.map(arg => JSON.stringify(arg));

			const ipcRenderer = require("electron").ipcRenderer;
			switch (type)
			{
				case "invoke":
					console.log(`invoke: ${channel}, args:`, ...parseArgs(args));

					ipcRenderer.invoke(channel, ...args).then((args: string) => resolve(JSON.parse(args))).catch(reject);
					break;
				case "msg":
					console.log(`msg: ${channel}, args:`, ...parseArgs(args));

					resolve(JSON.parse(ipcRenderer.sendSync(channel, ...parseArgs(args))));
					break;
				case "async-msg":
					{
						console.log(`async-msg: ${channel}, args:`, ...parseArgs(args));

						const id = await ipcRenderer.invoke(this.GET_IPC_ID_STRING);
						ipcRenderer.send(channel, id, ...parseArgs(args));
						ipcRenderer.once(this.channelToResponseString(channel, id), (event, arg) => 
						{
							resolve(JSON.parse(arg));
						});
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
	[name: string]: IpcHandler;
};

type IpcHandlerArgs<T> = T extends (...args: infer Args) => any ? Args : never;
type IpcHandlerReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
