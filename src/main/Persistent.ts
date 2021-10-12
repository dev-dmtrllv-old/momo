import { isMain } from "./env";
import { IPC } from "./Ipc";

export abstract class Persistent<Props>
{
	private static types_: { [key: string]: PersistentType<any> } = {};

	private static objects_: { [key: string]: Persistent<any> } = {};

	private static matchPropsKeys(a: any, b: any)
	{
		const ka = Object.keys(a);
		const kb = Object.keys(b);
		
		if(ka.length === kb.length)
		{
			for(const k of ka)
				if(!kb.find(check => check == k))
					return false;
			return true;
		}
		else
		{
			return false;
		}
	}

	public static register(name: string, type: PersistentType<any>)
	{
		return this.types_[name] = type;
	}

	public static init(appDataPath: string)
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
				
				const defaultProps = o.defaultProps();

				if (!fs.existsSync(p))
				{
					props = o.defaultProps();
					fs.writeFileSync(p, JSON.stringify(props), "utf-8");
				}

				props = JSON.parse(fs.readFileSync(p));

				if(!this.matchPropsKeys(props, defaultProps))
				{
					props = { ...defaultProps, ...props };
					fs.writeFileSync(p, JSON.stringify(props), "utf-8");
				}

				o.props = props;
			}
		}
	}

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

	protected abstract defaultProps(): Props;

	public readonly set = <K extends keyof Props>(key: K, val: Props[K]) =>
	{
		if (this.props[key] !== val)
		{
			this.props[key] = val;
			if (isMain)
			{
				const fs = require("fs");
				fs.writeFileSync(this.path, JSON.stringify(this.props), "utf-8");
			}
			else
			{
				IPC.call("update-persistent", this.name, key, val);
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
