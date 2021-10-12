import { SectionStore } from "app/stores/SectionStore";
import { Store } from "app/stores/Store";
import React from "react";
import { Header, ServerList } from "app/components";
import { FlexBox, FlexItem, View } from "../views";

import "./styles/app.scss";

const App = Store.withStore(SectionStore, ({ store }) =>
{
	return (
		<FlexBox id="app" fill position="absolute" dir="vertical">
			<FlexItem base={64}>
				<View position="absolute" fill theme="tertiary">
					<Header />
				</View>
			</FlexItem>
			<FlexItem>
				<FlexBox position="absolute" fill>
					<FlexItem base={64}>
						<ServerList />
					</FlexItem>
					<FlexItem>
						<View id="section-wrapper" position="absolute" fill>
							<store.sectionComponent />
						</View>
					</FlexItem>
				</FlexBox>
			</FlexItem>
		</FlexBox>
	);
});

export default App;
