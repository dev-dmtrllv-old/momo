import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import path from "path";
import { getServerProcChannel } from "../shared/ServerInfo";
import { MainWindow } from "./MainWindow";
import { Persistent } from "./Persistent";
import { Settings } from "./Settings";
import { Window } from "./Window";

export class ServerProcess
{
	private static readonly processes: { [name: string]: ServerProcess } = {};

	public static killAll()
	{
		for(const p in this.processes)
			this.processes[p].process?.kill();
	}

	public static get(name: string)
	{
		if (!this.processes[name])
			this.processes[name] = new ServerProcess(name);
		return this.processes[name];
	}

	public static getProcesses(): ProcessInfoGroup
	{
		const data: ProcessInfoGroup = {};
		Object.keys(this.processes).forEach(n => data[n] = {
			isRunning: this.processes[n].isRunning,
			output: this.processes[n].output_,
			errors: this.processes[n].errors_,
		});
		return data;
	}

	public readonly name: string;
	public readonly serverPath: string;

	private output_: string[] = [];
	private errors_: string[] = [];

	private isRunning_: boolean = false;
	private process: ChildProcessWithoutNullStreams | null = null;

	public get isRunning() { return this.isRunning_; }

	private constructor(name: string)
	{
		this.name = name;
		const serversPath = Persistent.get<Settings>(Settings).get("serversPath");
		this.serverPath = path.join(serversPath, name);
	}

	public start()
	{
		console.log(this.isRunning, this.process);

		if (!this.isRunning && !this.process)
		{
			this.isRunning_ = true;

			this.process = spawn("java", ["-jar", "-Xmx4G", "-Xms4G", "server.jar", "nogui"], {
				cwd: this.serverPath,
			});

			this.process.stdin.setDefaultEncoding("utf-8");

			const mainWindow = Window.get(MainWindow);

			this.process.stdout.on("data", (d) => 
			{
				d = d.toString();
				console.log("data", d.toString());
				this.output_.push(d);
				mainWindow.send(getServerProcChannel(this.name, "out"), d);
			});

			this.process.stderr.on("data", (d) =>
			{
				d = d.toString();
				console.log("error", d.toString());
				this.errors_.push(d);
				mainWindow.send(getServerProcChannel(this.name, "error"), d);
			});

			this.process.on("exit", (d) =>
			{
				console.log("exit");
				mainWindow.send(getServerProcChannel(this.name, "exit"));
				this.stop();
			});
		}
	}

	public stop()
	{
		if (this.isRunning)
		{
			this.isRunning_ = false;

			if (this.process)
			{
				this.process.kill();
				this.process = null;
			}
		}
	}

	public readonly sendCommand = (command: string) => new Promise<void>((res, rej) => 
	{
		console.log(`got command: ${command}`);
		if(this.process)
			this.process.stdin.write(command + "\r\n", "utf-8", (err) => err ? rej(err) : res());
	});

	// public static kill = () =>
	// {
	// 	for(const n in this.processes)
	// 	{

	// 	}
	// }
}

export type ProcessInfo = {
	isRunning: boolean;
	output: string[];
	errors: string[];
};

export type ProcessInfoGroup = {
	[key: string]: ProcessInfo;
};
