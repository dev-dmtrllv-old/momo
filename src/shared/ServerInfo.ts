export type ServerSettings = {
	difficulty: Difficulty;
	enableCommandBlock: boolean;
	gamemode: GameMode;
	motd: string;
	pvp: boolean;
	maxPlayers: number;
	viewDistance: number;
	ip: string;
	allowNether: boolean;
	simulationDistance: number;
	forceGameMode: boolean;
	whiteList: boolean;
	spawnNpcs: boolean;
	spawnAnimals: boolean;
	spawnMonsters: boolean;
	enforceWhiteList: boolean;
	spawnProtection: number;
	levelType: LevelType;
};

export const defaultServerSettings: ServerSettings = {
	allowNether: true,
	difficulty: "easy",
	enableCommandBlock: false,
	enforceWhiteList: false,
	forceGameMode: true,
	gamemode: "survival",
	ip: "127.0.0.1",
	maxPlayers: 20,
	motd: "A momo minecraft server!",
	pvp: true,
	simulationDistance: 12,
	spawnAnimals: true,
	spawnMonsters: true,
	spawnNpcs: true,
	spawnProtection: 6,
	viewDistance: 12,
	whiteList: false,
	levelType: "default"
}

export type ServerInfo = {
	name: string;
	version: string;
	color: string;
};

export type ServersProps = {
	servers: ServerInfo[];
};

export type Difficulty = "peaceful" | "easy" | "normal" | "hard";
export type GameMode = "survival" | "creative" | "adventure" | "spectator";
export type LevelType = "default" | "flat" | "largeBiomes" | "amplified" | "buffet" | "customized"; 

export const getServerProcChannel = (name: string, ...rest: string[]) => `server-proc-${name}-${rest.join("-")}`;
