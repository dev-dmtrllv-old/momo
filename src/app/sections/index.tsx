export * from "./Home";
export * from "./CreateServer";
export * from "./WebServer";
export * from "./Settings";
export * from "./Server";
export * from "./Servers";

import React from "react";
import { Home } from "./Home";
import { CreateServer } from "./CreateServer";
import { WebServer } from "./WebServer";
import { Settings } from "./Settings";
import { Server } from "./Server";
import { Servers } from "./Servers";

export namespace Sections
{
	export const routes: Sections = {
		"/": {
			component: Home,
			title: "Home",
			exact: true,
			link: "home",
			aliases: ["/home"]
		},
		"/web-server": {
			component: WebServer,
			title: "Web Server",
			exact: true,
			link: "web-server",
		},
		"/create-server": {
			component: CreateServer,
			title: "Create Server",
			exact: true,
			link: "create",
			aliases: ["/create-server"]
		},
		"/settings": {
			component: Settings,
			title: "Settings",
			exact: true,
			link: "settings",
			aliases: ["/settings"]
		},
		"/server": {
			component: Servers,
			title: "Servers",
		},
		"/server/:name": {
			component: Server,
			title: (path: string) => path.split("/").reverse()[0],
		}
	};

	export const links = (() => 
	{
		let l: LinkInfo[] = [];
		for (const p in routes)
		{
			const link = routes[p].link;
			if (link)
				l.push({ text: link, path: p, exact: routes[p].exact });
		}
		return l;
	})();

	export const getTitle = (path: string) => routes[path] || "";
};

type SectionInfo = {
	component: React.FC<any>;
	title: string | ((path: string) => string);
	exact?: boolean;
	link?: string;
	aliases?: string[];
};

type Sections = {
	[path: string]: SectionInfo;
}

type LinkInfo = {
	text: string;
	path: string;
	exact?: boolean;
};
