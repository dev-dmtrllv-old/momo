import { SectionStore } from "app/stores/SectionStore";
import { Store } from "app/stores/Store";
import React from "react";

import "./styles/header.scss";

export const Header: React.FC = Store.withStore(SectionStore, ({ store }) =>
{
	return (
		<div id="header">
			<h1>{store.title}</h1>
			{SectionStore.titles.map((title, i)=> <a key={i} onClick={() => store.routeTo(title)}>{title}</a>)}
		</div>
	);
});
