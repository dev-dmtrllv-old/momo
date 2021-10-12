import React from "react";
import { ipcRenderer } from "electron"
import { Button } from "app/views/Button";

import "./styles/prompt.scss";

const Prompt: React.FC<PromptProps> = ({ buttons, question }) =>
{
	const promptRef = React.createRef<HTMLDivElement>();
	const h1Ref = React.createRef<HTMLHeadingElement>()

	React.useEffect(() => 
	{
		const h1 = h1Ref.current;
		const p = promptRef.current; 
		if (p && h1)
		{
			const w = p.clientWidth > h1.clientWidth ? h1.clientWidth + 30 : p.clientWidth; 
			const h = p.clientHeight;
			ipcRenderer.send("prompt-ready", w, h);
		}

	}, []);

	return (
		<div id="prompt" ref={promptRef}>
			<div className="question">
				<h1 ref={h1Ref}>{question}</h1>
			</div>
			<div className="btns">
				{buttons.map((btn, i) => <Button onClick={() => ipcRenderer.send("prompt-response", btn.value)} key={i}>{btn.text}</Button>)}
			</div>
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
