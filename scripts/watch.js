const { webpack } = require("webpack");
const path = require("path");
const { spawn } = require("child_process");
const findProccess = require("find-process");
const rimraf = require("rimraf");

const appConfig = require("./webpack.config");
const mainConfig = require("./webpack.main");
const { readdirSync, mkdirSync, existsSync, copyFileSync, watch } = require("fs");

const distPath = path.resolve(__dirname, "../dist");

if (existsSync(distPath))
	rimraf.sync(path.resolve(__dirname, "../dist"));

mkdirSync(distPath);

let didAppCompile = false;
let didMainCompile = false;

let proc = null;

const restart = () =>
{
	if (proc !== null)
		proc.kill("SIGTERM");

	setTimeout(() => 
	{
		findProccess("name", "electron").then((v) => 
		{
			v.forEach(item => 
			{
				process.kill(item.pid);
			});
			setTimeout(() => 
			{
				proc = spawn("electron", [".", "--dev"], { cwd: path.resolve(__dirname, ".."), stdio: "inherit" });
			}, 500);
		});
	}, 150);
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


const assetsDir = path.resolve(__dirname, "../src/assets");
const distAssetsDir = path.resolve(__dirname, "../dist/assets");

if (!existsSync(distAssetsDir))
	mkdirSync(distAssetsDir);

readdirSync(assetsDir).forEach(f => 
{
	copyFileSync(path.resolve(assetsDir, f), path.resolve(__dirname, "../dist/assets", f));
})

watch(assetsDir, {}, (e, name) => 
{
	copyFileSync(path.resolve(assetsDir, name), path.resolve(__dirname, "../dist/assets", name));
});
