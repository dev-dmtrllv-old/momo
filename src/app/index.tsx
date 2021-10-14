import React from "react";
import ReactDOM from "react-dom";

import { AppInfo } from "../shared/AppInfo";
import { IPC } from "../shared/Ipc";
import { Store } from "./stores/Store";

const exec = (callback: Function) => callback();

const getAppInfo = (): AppInfo =>
{
	const search = window.location.search
	if (search)
	{
		const data: AppInfo = JSON.parse(decodeURI(window.location.search).substring(1, window.location.search.length)).data || {};
		if (!data.path)
			data.path = "App";
		return data;
	}
	else
	{
		return { path: "App" };
	}
}

exec(async () => 
{
	const root = document.createElement("div");
	root.id = "root";

	document.body.appendChild(root);

	const appInfo = getAppInfo();

	try
	{
		const appModule = await import(`./apps/${appInfo.path}`);
		await Store.initializeStores();
		const props = appInfo.data || {};
		ReactDOM.render(<appModule.default {...props} />, root);
	}
	catch (e)
	{
		console.error(e);
	}
});

