import fs from "fs";
import { resolve } from "path";
import { promisify } from "util";

export namespace FS
{
	const asyncRmDir = promisify(fs.rmdir);

	export const stat = promisify(fs.stat);
	export const exists = promisify(fs.exists);
	export const mkdir = promisify(fs.mkdir);
	export const ls = promisify(fs.readdir);
	export const writeFile = promisify(fs.writeFile);
	export const readFile = promisify(fs.readFile);
	export const rmFile = promisify(fs.unlink);
	
	export const rmdir = async (path: string) =>
	{
		const parts = await ls(path);
		await Promise.all(parts.map(async p => 
		{
					p = resolve(path, p);
					const s = await stat(p);
					return s.isFile() ? rmFile(p) : rmdir(p);
		}))
		await asyncRmDir(path);
	};
	// export const mvDir = ()promisify(fs.);
};
