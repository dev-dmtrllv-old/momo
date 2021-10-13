import { SectionStore } from "app/stores/SectionStore";
import { Store } from "app/stores/Store";
import { Container, FlexBox, FlexItem, View } from "app/views";
import React from "react";

import "./styles/header.scss";

export const Header: React.FC = Store.withStore(SectionStore, ({ store }) =>
{
	return (
		<View fill id="header">
			<Container fill >
				<View className="wrapper" position="absolute">
					<FlexBox>
						<FlexItem base={200}>
							<h1>{store.title}</h1>
						</FlexItem>
						<FlexItem>
							<View className="links" position="absolute">
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
						</FlexItem>
					</FlexBox>
				</View>
			</Container>
		</View>
	);
});
