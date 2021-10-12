import { Server } from "app/sections/Server";
import { Home } from "app/sections";
import { action, computed, observable } from "mobx";
import React from "react";
import { Store } from "./Store";
import { CreateServer } from "app/sections/CreateServer";
import { Settings } from "app/sections/Settings";

@Store.static
export class SectionStore extends Store
{
	private static readonly sections = {
		"Home": Home,
		"Server": Server,
		"Create": CreateServer,
		"Settings": Settings
	};

	public static get titles(): (keyof typeof SectionStore.sections)[] { return Object.keys(SectionStore.sections) as any; }

	@observable
	private sectionComponent_: React.FC = Home;
	
	@observable
	private title_: string = "Home";

	@computed
	public get sectionComponent() { return this.sectionComponent_; }

	@computed
	public get title() { return this.title_; }

	@action
	public routeTo = (key: keyof typeof SectionStore.sections) =>
	{
		this.title_ = key;
		this.sectionComponent_ = SectionStore.sections[key];
	}
}
