import { IPlayer, ITeamRid, IAllTeams, IGameTile } from "@stract/api";

export interface IRegisterWithTeam {
    teamName: string;
    id: ITeamRid;
    otherPlayers: IPlayer[];
}

export interface ILastPong {
    latency: number;
    timeStamp: Date;
}

export interface IPlayerWithTeamKey extends IPlayer {
    teamKey?: keyof IAllTeams<any>;
}

export interface ITeamRidToTeamKey {
    [teamRid: string]: keyof IAllTeams<any>;
}

export interface ISelectedTile {
    canSpawn?: boolean;
    columnIndex: number;
    dimension: number;
    gameTile: IGameTile;
    rowIndex: number;
}
