export type ServerSettings = {
	difficulty: Difficulty;
	enableCommandBlock: boolean;
	gamemode: GameMode;
	motd: string;
	pvp: boolean;
	maxPlayers: number;
	viewDistance: number;
	ip: number;
	allowNether: boolean;
	simulationDistance: boolean;
	forceGameMode: boolean;
	whiteList: boolean;
	spawnNpcs: boolean;
	spawnAnimals: boolean;
	spawnMonsters: boolean;
	enforceWhiteList: boolean;
	spawnProtection: number;
};

export type ServerInfo = {
	name: string;
	version: string;
};

export type ServersProps = {
	servers: ServerInfo[];
};

export type Difficulty = "hard" | "easy" | ""
export type GameMode = "survival" | "hardcore" | "creative";
