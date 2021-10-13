import { utils } from "../utils";
import { isMain } from "../shared/env";
import { IPC } from "../shared/Ipc";
import { Window } from "./Window";
import { MainWindow } from "./MainWindow";

export abstract class Persistent<Props>
{
	private static types_: { [key: string]: PersistentType<any> } = {};

	private static objects_: { [key: string]: Persistent<any> } = {};

	public static register(name: string, type: PersistentType<any>)
	{
		return this.types_[name] = type;
	}

	public static async init(appDataPath: string)
	{
		if (isMain)
		{
			const fs = require("fs");
			const path = require("path");

			if (!fs.existsSync(appDataPath))
				fs.mkdirSync(appDataPath);

			for (const name in this.types_)
			{
				const p = path.resolve(appDataPath, name + ".json");
				const o: Persistent<any> = this.objects_[name] = new this.types_[name](name, p);
				
				let props: any;
				
				const defaultProps = await o.defaultProps();

				if (!fs.existsSync(p))
				{
					props = o.defaultProps();
					fs.writeFileSync(p, JSON.stringify(props), "utf-8");
				}

				props = JSON.parse(fs.readFileSync(p));

				if(!utils.equals(props, defaultProps))
				{
					props = { ...defaultProps, ...props };
					fs.writeFileSync(p, JSON.stringify(props), "utf-8");
				}

				o.props = props;
			}
		}
	}

	public static get<T extends Persistent<any>>(arg: PersistentType<T>): T;
	public static get<T extends Persistent<any>>(arg: string): Persistent<any> | null;
	public static get<T extends Persistent<any>>(arg: PersistentType<T> | string): T | null
	{
		if (typeof arg === "string")
		{
			for (const name in this.objects_)
				if (name === arg)
					return this.objects_[name] as T;

		}
		else
		{
			for (const name in this.objects_)
				if (this.objects_[name].constructor === arg)
					return this.objects_[name] as T;

		} 
		return null;
	}

	protected props!: Props;

	public readonly name: string;
	public readonly path: string;

	public constructor(name: string, path: string)
	{
		this.name = name;
		this.path = path;
	}

	protected abstract defaultProps(): Props | Promise<Props>;

	public readonly set = async <K extends keyof Props>(key: K, val: Props[K]) =>
	{
		if (this.props[key] !== val)
		{
			this.props[key] = val;
			if (isMain)
			{
				const fs = require("fs");
				Window.get(MainWindow).send(`persistent-${this.name}-updated`, key, JSON.stringify(val));
				fs.writeFileSync(this.path, JSON.stringify(this.props), "utf-8");
			}
			else
			{
				await IPC.call("update-persistent", this.name, key, val);
			}
		}
	}

	public readonly get = <K extends keyof Props>(key: K): Props[K] => this.props[key];

	public readonly update = <K extends keyof Props>(key: K, updater: (val: Props[K]) => Props[K]) => this.set(key, updater(this.get(key)));

	public serialize(): string
	{
		return JSON.stringify(this.props);
	}
}

type PersistentType<T extends Persistent<any>> = new (name: string, path: string) => T;
type InferPersistenProps<T> = T extends Persistent<infer P> ? P : never;
