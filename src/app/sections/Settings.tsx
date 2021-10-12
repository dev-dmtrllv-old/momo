import React from "react";
import { SettingsStore } from "app/stores/SettingsStore";
import { Store } from "app/stores/Store";
import { View } from "app/views";

export const Settings = Store.withStore(SettingsStore, ({ store }) =>
{
	return (
		<>
			{store.keys.map((key, i) => 
			{
				const data = store.get(key);
				return (
					<View key={i}>
						{key}: <input onChange={(e) => store.set(key, e.target.value)} value={data}/>
					</View>
				);
			})}
		</>
	);
});
