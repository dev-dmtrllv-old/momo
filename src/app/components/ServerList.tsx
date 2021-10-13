import { SectionStore } from "app/stores/SectionStore";
import { ServerListStore } from "app/stores/ServerListStore";
import { Store } from "app/stores/Store";
import { View, WithViewProps } from "app/views";
import React from "react";
import { ServerInfo } from "shared/ServerInfo";
import { utils } from "utils";

import "./styles/server-list.scss";

const Badge: React.FC<WithViewProps<BadgeProps>> = ({ className, children, onHover, onHoverEnd, ...rest }) =>
{
	return (
		<View className={utils.react.getClassFromProps("badge", { className })} {...rest} theme="primary" onMouseEnter={onHover} onMouseLeave={onHoverEnd}>
			<View position="absolute" center>
				{children}
			</View>
		</View>
	);
};

const ListBadge: React.FC<ListBadgeProps> = ({ serverInfo, children, ...rest }) =>
{
	const p = serverInfo.name.split(" ");

	let name = p[0][0];

	if (p[1])
		name += ` ${p[1][0]}`;

	return (
		<Badge {...rest}>
			{name}
		</Badge>
	);
}

const NewServerBadge: React.FC<BadgeProps> = Store.withStore(SectionStore, ({ store, children, ...props }) => 
{
	return (
		<Badge className="new" onClick={() => store.routeTo("Create")} {...props}>
			&#43;
		</Badge>
	);
});

const ToolTip: React.FC<{ hoverEl: HTMLDivElement | null, show: boolean }> = ({ children, show, hoverEl }) =>
{
	if (!show || !hoverEl)
		return null;

	const top = (!hoverEl ? 0 : (hoverEl.offsetTop + 5)) + "px";

	return (
		<View id="server-list-tooltip" position="absolute" style={{ top }}>
			{children}
		</View>
	);
};

export const ServerList = Store.withStore(ServerListStore, ({ store }) =>
{
	const [hoverState, setHoverState] = React.useState<ServerListState>({ hoverIndex: -2, hoverEl: null })

	const onHover = (e: React.MouseEvent<HTMLDivElement>, i: number) => 
	{
		if (hoverState.hoverIndex !== i)
			setHoverState({ hoverIndex: i, hoverEl: e.target as HTMLDivElement });
	};

	const onHoverEnd = (e: React.MouseEvent<HTMLDivElement>, i: number) =>
	{
		if (hoverState.hoverIndex === i)
			setHoverState({ hoverIndex: -2, hoverEl: hoverState.hoverEl });
	};

	return (
		<>
			<View id="server-list" position="absolute" theme="secundary" fill>
				<View className="badge-wrapper">
					<NewServerBadge onHover={(e) => onHover(e, -1)}  onHoverEnd={(e) => onHoverEnd(e, -1)}/>
					{store.props.servers.map((s, i) => <ListBadge serverInfo={s} key={i} onHover={(e) => onHover(e, i)} onHoverEnd={(e) => onHoverEnd(e, i)} />)}
				</View>
				<ToolTip hoverEl={hoverState.hoverEl} show={hoverState.hoverIndex > -2}>
					{hoverState.hoverIndex > -1 ? (
						<>
							<span className="name">
								<span className="prefix">name: </span>
								{store.props.servers[hoverState.hoverIndex].name}
							</span>
							<span className="version">
								<span className="prefix">version: </span>
								{store.props.servers[hoverState.hoverIndex].version}
							</span>
						</>
					) : (hoverState.hoverIndex === -1 && "New Server")}
				</ToolTip>
			</View>
		</>
	);
});

type ListBadgeProps = {
	serverInfo: ServerInfo;
} & BadgeProps;

type BadgeProps = {
	onHover?: (e: React.MouseEvent<HTMLDivElement>) => any;
	onHoverEnd?: (e: React.MouseEvent<HTMLDivElement>) => any;
};

type ServerListState = {
	hoverIndex: number;
	hoverEl: HTMLDivElement | null;
};
