import React from "react";
import { Header } from "../components/Header";
import { ServerSideList } from "../components/ServerSideList";
import { Home } from "../sections";
import { FlexBox, FlexItem, View } from "../views";

import "./styles/app.scss";

const AppContext = React.createContext<AppContextType>({ section: Home, routeToSection: (s: React.FC<unknown>) => { } });

const App = () =>
{
	const [state, setState] = React.useState({ section: Home });

	return (
		<AppContext.Provider value={{ section: state.section, routeToSection: (s: React.FC<unknown>) => setState({ section: s }) }}>
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

type AppContextType = {
	section: React.FC<unknown>,
	routeToSection: (section: React.FC<unknown>) => void
};

export default App;
