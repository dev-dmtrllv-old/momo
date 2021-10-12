import { SectionStore } from "app/stores/SectionStore";
import { Store } from "app/stores/Store";
import React from "react";
import { Header } from "app/components";
import { FlexBox, FlexItem, View } from "../views";

import "./styles/app.scss";

const App = Store.withStore(SectionStore, ({ store }) =>
{
	return (
		<FlexBox id="app" fill position="absolute" dir="vertical">
			<FlexItem base={64}>
				<View position="absolute" fill>
					<Header />
				</View>
			</FlexItem>
			<FlexItem>
				<View id="section-wrapper" position="absolute" fill>
					<store.sectionComponent />
				</View>
			</FlexItem>
		</FlexBox>
	);
});

type AppContextType = {
	section: React.FC<unknown>;
	routeToSection: (section: React.FC<unknown>, title?: string) => void;
	setTitle: (title: string) => void;
	readonly title: string;
};

export default App;
