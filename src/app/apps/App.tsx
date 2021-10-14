import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Header, ServerList } from "app/components";
import { FlexBox, FlexItem, View } from "../views";

import { Home } from "app/sections";
import { WebServer } from "app/sections/WebServer";
import { CreateServer } from "app/sections/CreateServer";
import { Settings } from "app/sections/Settings";

import "./styles/app.scss";

const App = ({  }) =>
{
	return (
		<HashRouter>
			<FlexBox id="app" fill position="absolute" dir="horizontal" theme="primary">
				<FlexItem base={64}>
					<ServerList />
				</FlexItem>
				<FlexItem>
					<FlexBox position="absolute" dir="vertical" fill>
						<FlexItem base={64}>
							<View position="absolute" fill theme="tertiary">
								<Header />
							</View>
						</FlexItem>
						<FlexItem>
							<View id="section-wrapper" position="absolute" fill>
								<View className="content">
									<Switch>
										<Route exact path="/">
											<Home />
										</Route>
										<Route exact path="/web-server">
											<WebServer />
										</Route>
										<Route exact path="/create-server">
											<CreateServer />
										</Route>
										<Route exact path="/settings">
											<Settings />
										</Route>
									</Switch>
								</View>
							</View>
						</FlexItem>
					</FlexBox>
				</FlexItem>
			</FlexBox>
		</HashRouter>
	);
};

export default App;
