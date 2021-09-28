const { webpack } = require("webpack");
const path = require("path");
const { spawn } = require("child_process");
const findProccess = require("find-process");

const appConfig = require("./webpack.app");
const mainConfig = require("./webpack.main");

let didAppCompile = false;
let didMainCompile = false;

let proc = null;

const restart = () =>
{
	if (proc !== null)
		proc.kill();

	findProccess("name", "electron").then((v) => 
	{
		v.forEach(item => 
		{
			process.kill(item.pid);
		});
		setTimeout(() => 
		{
			proc = spawn("electron", ["."], { cwd: path.resolve(__dirname, ".."), stdio: "inherit" });
		}, 500);
	});
}

const isRunning = () => didAppCompile && didMainCompile;

webpack(appConfig).watch({}, (a, stats) => 
{
	if (didMainCompile && !didAppCompile)
		restart();
	didAppCompile = true;
	console.log(`\n[App]:`);
	console.log(stats.toString("minimal"));
	console.log("");
});

webpack(mainConfig).watch({}, (a, stats) => 
{
	if (didAppCompile && !didMainCompile)
		restart();
	else if (isRunning())
		restart();

	didMainCompile = true;
	console.log(`\n[Main]:`);
	console.log(stats.toString("minimal"));
	console.log("");
});
