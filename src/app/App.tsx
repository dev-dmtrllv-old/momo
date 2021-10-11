import React from "react";
import { Header } from "./components/Header";
import { Home } from "./sections/Home";
import { FlexBox, FlexItem, View } from "./views";
import { ServerSideList } from "./components/ServerSideList";

import "./app.scss";

const AppContext = React.createContext<AppContextType>({ section: Home, routeToSection: (s: ReactEl) => { } });

const App = () =>
{
	const [state, setState] = React.useState({ section: Home });

	return (
		<AppContext.Provider value={{ section: state.section, routeToSection: (s: ReactEl) => setState({ section: s }) }}>
			<FlexBox id="app" fill position="absolute" dir="vertical">
				<FlexItem base={64}>
					<View position="absolute" fill>
						<Header />
					</View>
				</FlexItem>
				<FlexItem>
					<FlexBox fill position="absolute" dir="horizontal">
						<FlexItem base={86}>
							<View position="absolute" fill>
								<ServerSideList />
							</View>
						</FlexItem>
						<FlexItem>
							<View id="section-wrapper" position="absolute" fill>
								<state.section />
							</View>
						</FlexItem>
					</FlexBox>
				</FlexItem>
			</FlexBox>
		</AppContext.Provider>
	);
}

type ReactEl = () => JSX.Element;

type AppContextType = {
	section: ReactEl,
	routeToSection: (section: ReactEl) => void
};

export default App;
