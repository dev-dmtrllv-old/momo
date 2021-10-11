const { webpack } = require("webpack");
const path = require("path");
const { watch, copyFileSync, readdirSync, existsSync, mkdirSync, fstat } = require("fs");
const { spawn } = require("child_process");
const findProccess = require("find-process");
const rimraf = require("rimraf");

const distPath = path.resolve(__dirname, "../dist");

if (existsSync(distPath))
	rimraf.sync(path.resolve(__dirname, "../dist"));

mkdirSync(distPath);

const appConfig = require("./webpack.config");

let didAppCompile = false;

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
			proc = spawn("electron", [".", "--dev"], { cwd: path.resolve(__dirname, ".."), stdio: "inherit" });
			proc.on("exit", (code) => console.log(`app exited with code ${code}!`));
		}, 500);
	});
}

webpack(appConfig).watch({}, (a, stats) => 
{
	if (!didAppCompile)
	{
		didAppCompile = true;

		spawn("tsc", "--watch -p main.tsconfig.json".split(" "), {
			stdio: "inherit"
		});

		let timeout = null;

		watch(path.resolve(__dirname, "../dist"), {}, (e, name) => 
		{
			if (timeout)
				clearTimeout(timeout);
			timeout = setTimeout(() => 
			{
				restart();
			}, 150);
		});
	}
	console.log(`\n[App]:`);
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
