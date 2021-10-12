import { SectionStore } from "app/stores/SectionStore";
import { ServerListStore } from "app/stores/ServerListStore";
import { Store } from "app/stores/Store";
import { View, WithViewProps } from "app/views";
import React from "react";
import { ServerInfo } from "shared/ServerInfo";
import { utils } from "utils";

import "./styles/server-list.scss";

const Badge: React.FC<WithViewProps<{}>> = ({ className, children, ...rest }) =>
{
	return (
		<View className={utils.react.getClassFromProps("badge", { className })} {...rest} theme="primary">
			<View position="absolute" center>
				{children}
			</View>
		</View>
	);
};

const ListBadge: React.FC<ListBadgeProps> = ({ serverInfo }) =>
{
	const p = serverInfo.name.split(" ");

	let name = p[0];

	if (p[1])
		name += ` ${p[1]}`;

	return (
		<Badge>
			{name}
		</Badge>
	);
}

const NewServerBadge = Store.withStore(SectionStore, ({ store }) => 
{
	return (
		<Badge className="new" onClick={() => store.routeTo("Create")}>
			&#43;
		</Badge>
	);
});

export const ServerList = Store.withStore(ServerListStore, ({ store }) =>
{
	return (
		<View id="server-list" position="absolute" theme="secundary" fill>
			<NewServerBadge />
			{store.props.servers.map((s, i) => <ListBadge serverInfo={s} key={i} />)}
		</View>
	);
});

type ListBadgeProps = {
	serverInfo: ServerInfo;
};
