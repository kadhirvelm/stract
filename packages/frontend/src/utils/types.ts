import {
    IAllTeams,
    IColumnIndex,
    IGameActionType,
    IGameTile,
    IOccupiedBy,
    IOccupiedByAlive,
    IPlayer,
    IRowIndex,
    ITeamRid,
} from "@stract/api";

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
    columnIndex: IColumnIndex;
    dimension: number;
    occupiedByAlive: IOccupiedByAlive | undefined;
    rowIndex: IRowIndex;
}

export type IWaterDirections = "north west" | "north east" | "south east" | "south west";

export interface IFlattenedBoard {
    parentTile: IGameTile;
    rowIndex: IRowIndex;
    columnIndex: IColumnIndex;
    occupiedBy: IOccupiedBy | undefined;
}

export type IPieceSize = "board" | "spawn" | "sidebar";

export type ITilesInStagedActions = Map<string, IGameActionType[]>;
