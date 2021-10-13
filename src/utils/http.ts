import { isMain } from "../shared/env";
import fs from "fs";

export namespace http
{
	export const get = (url: string) => new Promise<string>((res, rej) =>
	{
		if (isMain)
		{
			const https = require(url[4] === 's' ? "https" : "http");
			https.get(url, (response: any) => 
			{
				let data: string = "";
				response.on("data", (d: string) => data += d);
				response.on("end", () => res(data));
				response.on("error", rej);
			});
		}
		else
		{
			return fetch(url).then(r => r.text());
		}
	});

	export const download = (location: string, url: string) => new Promise<string>((res, rej) =>
	{
		if (isMain)
		{
			fs.exists(location, (exists) => 
			{
				if (exists)
				{
					res(location);
				}
				else
				{
					const https = require(url[4] === 's' ? "https" : "http");
					const ws = fs.createWriteStream(location);
					ws.on("close", () => res(location));
					ws.on("error", rej);
					https.get(url, (response: any) => 
					{
						response.on("end", () => ws.close());
						response.on("error", rej);
						response.pipe(ws);
					});
				}
			})

		}
		else
		{
			return fetch(url).then(r => r.text());
		}
	});

};
