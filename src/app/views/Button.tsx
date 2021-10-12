import React from "react";
import { WithReactProps } from ".";
import { utils } from "../../utils";

import "./styles/btn.scss";

export const Button: React.FC<WithReactProps<ButtonProps, HTMLButtonElement>> = ({ children, className, ...props }) => 
{
	return <button className={utils.react.getClassFromProps("btn", { className })} {...props}>{children}</button>;
};

type ButtonProps = {
	
};
