import { IPlayer, ITeamRid, IAllTeams, IGameTile, IOccupiedBy, IOccupiedByAlive } from "@stract/api";

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
    occupiedByAlive: IOccupiedByAlive | undefined;
    rowIndex: number;
}

export type IWaterDirections = "north west" | "north east" | "south east" | "south west";

export interface IFlattenedBoard {
    parentTile: IGameTile;
    rowIndex: number;
    columnIndex: number;
    occupiedBy: IOccupiedBy | undefined;
}

export type IPieceSize = "board" | "spawn" | "sidebar";
