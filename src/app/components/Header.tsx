import { SectionStore } from "app/stores/SectionStore";
import { Store } from "app/stores/Store";
import { Container, FlexBox, FlexItem, View } from "app/views";
import React from "react";

import "./styles/header.scss";

export const Header: React.FC = Store.withStore(SectionStore, ({ store }) =>
{
	return (
		<View fill id="header">
			<Container fill className="wrapper" position="relative">
				<View className="title"><h1>{store.title}</h1></View>
				<View className="links">
					{SectionStore.titles.map((title, i) => 
					{
						const isActive = title === store.title;
						return (
							<a key={i} className={isActive ? "active" : ""} onClick={() => store.routeTo(title)}>
								{title}
							</a>
						);
					})}
				</View>
			</Container>
		</View>
	);
});
