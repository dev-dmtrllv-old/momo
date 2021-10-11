import React from "react";
import { ipcRenderer } from "electron"

const Prompt: React.FC<PromptProps> = ({ buttons, question }) =>
{
	return (
		<div>
			<h1>{question}</h1>
			{buttons.map((btn, i)=> <button onClick={() => ipcRenderer.send("response", btn.value)} key={i}>{btn.text}</button>)}
		</div>
	);
}

type PromptButton = {
	text: string;
	value: any;
};

type PromptProps = {
	question: string;
	buttons: PromptButton[];
};

export default Prompt;
