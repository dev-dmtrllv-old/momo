import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";

import { Container, View } from "app/views";
import { Sections } from "app/sections";

import "./styles/header.scss";

export const Header: React.FC = ({ }) =>
{
	const location = useLocation();

	const title_ = Sections.getTitle(location.pathname).title;
	
	const t = typeof title_ === "function" ? title_(location.pathname) : title_;

	return (
		<View fill id="header">
			<Container fill className="wrapper" position="relative">
				<View className="title"><h1>{t}</h1></View>
				<View className="links">
					{Sections.links.map((link, i) => <NavLink className="link" key={i} to={link.path} exact={link.exact}>{link.text}</NavLink>)}
				</View>
			</Container>
		</View>
	);
};
