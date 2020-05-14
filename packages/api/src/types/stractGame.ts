import { IGameAction } from "./gameAction";
import { IGamePieceType } from "./gamePiece";
import { IGameTile } from "./gameTile";
import { IPlayer } from "./player";
import { ITeamRid, IStractBoardId } from "./idTypes";

export interface IBoardMetadata {
    size: {
        columns: number;
        rows: number;
    };
}

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
    players: IPlayer[];
}

export interface IAllTeams<T> {
    north: T;
    south: T;
}

export interface IStractGameV1 {
    metadata: {
        board: IBoardMetadata;
        id: IStractBoardId;
        roomName: string;
    };
    board: Array<Array<IGameTile>>;
    stagedActions: IAllTeams<Array<IGameAction>>;
    teams: IAllTeams<IBoardTeamMetadata>;
    turnNumber: number;
}
