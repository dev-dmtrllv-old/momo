import fs from "fs";
import { promisify } from "util";

export namespace FS
{
	export const exists = promisify(fs.exists);
	export const mkdir = promisify(fs.mkdir);
	export const rmdir = promisify(fs.rmdir);
	export const ls = promisify(fs.readdir);
	export const writeFile = promisify(fs.writeFile);
	export const readFile = promisify(fs.readFile);
	export const rmFile = promisify(fs.unlink);
	
	// export const mvDir = ()promisify(fs.);
};
