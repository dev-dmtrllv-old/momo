import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

const exec = (callback: Function) => callback();

exec(() => 
{
	const root = document.createElement("div");
	root.id = "root";
	document.body.appendChild(root);
	ReactDOM.render(<App />, root);
});
