import React from "react";
import { FlexBox, FlexItem, Input, View } from "app/views";

import "./styles/server-io-panel.scss";

export const ServerIOPanel: React.FC<ServerIOPanelProps> = ({ lines, onInput, ...rest }) =>
{
	const ref = React.createRef<HTMLDivElement>();

	const [isScrolledDown, setIsScrolledDown] = React.useState(true);

	const [val, setVal] = React.useState("");
	const [output, setOutput] = React.useState(lines);

	const onScroll = (e: Event) =>
	{
		const t = e.target as HTMLDivElement;
		const sd = t.scrollHeight - t.scrollTop == t.clientHeight;
		setIsScrolledDown(sd);
	}

	React.useEffect(() =>
	{
		if (ref.current)
			ref.current.addEventListener("scroll", onScroll);

		return () => 
		{
			if (ref.current)
				ref.current.removeEventListener("scroll", onScroll);
		};
	}, []);

	React.useEffect(() =>
	{
		setOutput(lines);
	}, [lines]);

	React.useEffect(() => 
	{
		if (isScrolledDown && ref.current)
			ref.current.scrollTop = ref.current.scrollHeight;
	}, [output]);

	const onKeyDown = (e: React.KeyboardEvent) =>
	{
		if (e.code === "Enter") 
		{
			onInput && onInput(val);
			setVal("");
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value);

	return (
		<View className="server-io-panel">
			<FlexBox fill dir="vertical">
				<FlexItem base={520}>
					<View className="output" fill forwardRef={ref} >
						{output.map((s, i) => <View key={i}>{s}</View>)}
					</View>
				</FlexItem>
				<FlexItem className="in">
					{onInput && (
						<Input type="text" onChange={onChange} value={val} placeholder="" name="command" onKeyDown={onKeyDown} />
					)}
				</FlexItem>
			</FlexBox>
		</View>
	);
}

type ServerIOPanelProps = {
	lines: string[];
	onInput?: (input: string) => any;
};
