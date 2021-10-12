import React from "react";
import { observer } from "mobx-react";
import { makeObservable } from "mobx";

export abstract class Store
{
	public static static(ctor: Function)
	{
		const type = ctor as StoreType<any>;
		let s = Store.get(type);
		if (!s)
		{
			s = new type();
			Store.stores.push(s);
		}
	}

	private static stores: Store[] = [];

	public static withStore<T extends Store, P>(type: StoreType<T>, component: React.FC<P & { store: T }>): React.FC<P>
	{
		return (props: P) => React.createElement(observer(component), { ...props, store: this.get<T>(type)! });
	}

	public static withStores<T extends StoreTypeGroup, P>(types: T, component: React.FC<P & T>): React.FC<P>
	{
		return (props: P) => 
		{
			const stores: any = {};
			for (const k in types)
				stores[k] = this.get(types[k]);
			return React.createElement(observer(component), { ...props, ...stores });
		};
	}

	public static get<T extends Store>(type: StoreType<T>): T | null
	{
		return (this.stores.find(s => s.constructor === type) as T) || null;
	}

	public static async initializeStores()
	{
		for (const s of this.stores)
		{
			await s.init();
			makeObservable(s);
		}
	}

	protected init(): any { }
};

type StoreType<T extends Store> = new () => T;

type StoreTypeGroup = {
	[key: string]: StoreType<any>;
};

type StoreGroup<T extends StoreTypeGroup> = {
	[K in keyof T]: InferStoreType<T[K]>;
};

type InferStoreType<T> = T extends StoreType<infer S> ? S : never;
