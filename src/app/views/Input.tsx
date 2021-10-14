import React from "react";
import { utils } from "../../utils";
import { View } from "./View";

import "./styles/input.scss";

export const Input: React.FC<InputProps> = ({ children, className, onChange, type = "text", name, placeholder, value = "", ...props }) => 
{
	const [hasFocus, setFocus] = React.useState(false);
	const [isEmpty, setisEmpty] = React.useState(value.length === 0);

	if (!name && placeholder)
		name = placeholder;
	else if (!placeholder && name)
		placeholder = name;

	const onFocus = () => setFocus(true);
	const onBlur = () => setFocus(false);
	const onChange_ = (e: React.ChangeEvent<HTMLInputElement>) => 
	{
		onChange && onChange(e);
		if (!e.defaultPrevented)
		{
			const isEmpty_ = e.target.value.length === 0;
			if (isEmpty !== isEmpty_)
				setisEmpty(isEmpty_);
		}
	}

	const cn = utils.react.getClassFromProps("input", { className, type, focus: hasFocus });

	return (
		<View className={utils.react.getClassFromProps("input-wrapper", { focus: hasFocus, empty: isEmpty })}>
			<input type={type} name={name} value={value} onChange={onChange_} className={cn} {...props} onFocus={onFocus} onBlur={onBlur} />
			<View className="placeholder" position="absolute">
				{placeholder}{(hasFocus || !isEmpty) ? ":" : ""}
			</View>
		</View>
	);
};

type InputProps = {
	className?: string;
	type?: "text" | "password" | "email";
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
	placeholder?: string;
	value?: string;
	name?: string;
};
