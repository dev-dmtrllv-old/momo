const { webpack } = require("webpack");
const path = require("path");
const fs = require("fs");
const downloadElectron = require("electron-download");
const unzip = require("unzip");
const rimraf = require("rimraf");

const appConfig = require("./webpack.config");

const pkg = require("../package.json");
const { spawn } = require("child_process");

const buildPath = path.resolve(__dirname, "../build");
const appPath = path.resolve(buildPath, "resources", "app");
const appRendererPath = path.resolve(buildPath, "resources", "app", "app");
const defaultAppAsarPath = path.resolve(buildPath, "resources", "default_app.asar");

const finish = () =>
{
	const pkgData = {
		name: pkg.name,
		version: pkg.version,
		main: "index.js",
		dependencies: pkg.dependencies
	};

	fs.writeFileSync(path.resolve(appPath, "package.json"), JSON.stringify(pkgData), "utf-8");


	const assetsDir = path.resolve(__dirname, "../src/assets");
	const distAssetsDir = path.resolve(__dirname, "../build/resources/app/assets");

	if (!fs.existsSync(distAssetsDir))
		fs.mkdirSync(distAssetsDir);

	fs.readdirSync(assetsDir).forEach(f => 
	{
		fs.copyFileSync(path.resolve(assetsDir, f), path.resolve(distAssetsDir, f));
	})
}

const build = () =>
{
	if (fs.existsSync(appPath))
		rimraf.sync(appPath);

	let appDone = false;
	let mainDone = false;

	appConfig.devtool = undefined;
	appConfig.mode = "production";
	appConfig.output.path = appRendererPath;

	const tsc = spawn("tsc", `-p main.tsconfig.json --outDir ${appPath} --sourceMap false`.split(" "), {
		stdio: "inherit"
	});

	webpack(appConfig).run((_, stats) => 
	{
		console.log(`\n[App]:`);
		console.log(stats.toString("minimal"));
		console.log("");

		if (mainDone)
			finish();
		else
			appDone = true;
	});

	tsc.on("exit", () => 
	{
		if (appDone)
			finish();
		else
			mainDone = true;
	});
}

if (fs.existsSync(buildPath))
{
	build();
}
else
{
	downloadElectron({
		version: pkg.devDependencies.electron.replace("^", ""),
	}, (err, zipPath) =>
	{
		if (err)
			throw err;

		const stream = fs.createReadStream(zipPath);
		stream.on("close", () => 
		{
			if (fs.existsSync(defaultAppAsarPath))
				fs.unlinkSync(defaultAppAsarPath);
			build();
		});
		stream.pipe(unzip.Extract({ path: buildPath }));
	});
}
