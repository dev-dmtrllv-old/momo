import React from "react";
import ReactDOM from "react-dom";

const exec = (callback: Function) => callback();

const getAppInfo = (): AppInfo =>
{
	const search = window.location.search
	if (search)
	{
		const data = JSON.parse(decodeURI(window.location.search).substring(1, window.location.search.length)).data || {};

		if (!data.target)
			data.target = "app";
		return data;
	}
	else
	{
		return { target: "app" };
	}

}

exec(async () => 
{
	const root = document.createElement("div");
	root.id = "root";

	document.body.appendChild(root);

	const appInfo = getAppInfo();

	let app: JSX.Element;

	switch (appInfo.target)
	{
		case "app":
			const App = (await import("./App")).default;
			app = <App />;
			break;
		case "prompt":
			const Prompt = (await import("./Prompt")).default;
			app = <Prompt buttons={appInfo.buttons} question={appInfo.question} />;
			break;
	}

	ReactDOM.render(app, root);

});

type AppInfo = {
	target: "app" | "prompt";
	[key: string]: any;
}

