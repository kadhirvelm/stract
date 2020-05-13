import { IGameTile } from "./gameTile";
import { ITeamRid } from "./team";
import { IGameAction } from "./gameAction";
import { Brand, createBrandedGeneric } from "../common";
import { IGamePieceType } from "./gamePiece";

export interface IBoardMetadata {
    size: {
        columns: number;
        rows: number;
    };
}

export type IStractBoardId = Brand<string, "board-id">;
export const stractBoardId = createBrandedGeneric<string, IStractBoardId>();

export interface IBoardTeamPiecePool {
    total: number;
    type: IGamePieceType;
}

export interface IBoardTeamMetadata {
    id: ITeamRid;
    name: string;
    piecePool: {
        available: IBoardTeamPiecePool[];
        total: IBoardTeamPiecePool[];
    };
}

export interface IBoardStagedAction {
    ownedByTeam: ITeamRid;
}

interface IAllTeams<T> {
    north: T;
    south: T;
}

export interface IStractGame {
    metadata: {
        board: IBoardMetadata;
        id: IStractBoardId;
        roomName: string;
    };
    board: Array<Array<IGameTile>>;
    stagedActions: IAllTeams<Array<IGameAction & IBoardStagedAction>>;
    teams: IAllTeams<IBoardTeamMetadata>;
    turnNumber: number;
}
