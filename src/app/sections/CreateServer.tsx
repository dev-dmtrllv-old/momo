import { CreateServerStore } from "app/stores/CreateServerStore";
import { Store } from "app/stores/Store";
import { Button, CheckBox, Container, FlexBox, FlexItem, Input, View } from "app/views";
import { Select } from "app/views/Select";
import React from "react";

import Grass from "../../assets/grass.jpg";

import "./styles/create-server.scss";

export const CreateServer = Store.withStore(CreateServerStore, ({ store }) =>
{
	const changeFilterType = (name: string, selected: boolean) =>
	{
		store.setVersionFilterType(name, selected);
	}

	return (
		<Container>
			<View id="create-server">
				<View className="panel"  theme="secundary">
					<View className="background" style={{ backgroundColor: store.getInputvalue("color") }}>
						<View className="badge-image" position="absolute">
							<View style={{ backgroundImage: `url(${Grass})` }}>
								<View className="initials" position="absolute" center>
									{store.getInitials().join("")}
								</View>
							</View>
						</View>
					</View>

					<View className="form">
						<View className="input-group">
							<Input placeholder="name" name="name" onChange={(e) => store.onInputChange("name", e.target.value)} value={store.getInputvalue("name")} />
						</View>

						<FlexBox dir="horizontal" className="input-group">
							<FlexItem>
								<Select placeholder="version" name="version" onChange={(e) => store.onInputChange("version", e.target.value)} value={store.getInputvalue("version")}>
									{store.versions.map((v, i) => <option key={i} value={v.id}>{v.id}</option>)}
								</Select>
							</FlexItem>
							<FlexItem>
								{CreateServerStore.VERSION_TYPES.map((type, i) => 
								{
									return (
										<CheckBox key={i} name={type} selected={store.isVersionTypeSelected(type)} onChange={(e) => changeFilterType(e.name, e.selected)} />
									);
								})}
							</FlexItem>
						</FlexBox>

						<Button onClick={store.create}>
							Create
						</Button>
					</View>
				</View>
			</View>
		</Container>
	);
});
