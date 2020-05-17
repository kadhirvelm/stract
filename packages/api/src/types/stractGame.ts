import { IGameAction } from "./gameAction";
import { IGamePieceType } from "./gamePiece";
import { IGameTile } from "./gameTile";
import { IPlayer } from "./player";
import { ITeamRid, IStractBoardId } from "./idTypes";
import { IGameState } from "./gameState";

export type CURRENT_GAME_STATE_VERSION = "1.3.0";
export const CURRENT_GAME_STATE_VERSION = "1.3.0";

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
        /**
         * The number of pieces a team can spawn. This accounts for both the pieces that have been destroyed and the pieces that have been spawned.
         */
        available: IBoardTeamPiecePool[];
        /**
         * The total available pieces a team has. This accounts only for the pieces that have been destroyed.
         */
        total: IBoardTeamPiecePool[];
    };
    players: IPlayer[];
    score: number;
}

export interface IAllTeams<T> {
    north: T;
    south: T;
}

export interface ITurnsMetadata {
    timePerTurnInSeconds: number;
    totalTurns: number;
}

export interface IStractGameV1 {
    metadata: {
        board: IBoardMetadata;
        id: IStractBoardId;
        roomName: string;
        turns: ITurnsMetadata;
    };
    board: Array<Array<IGameTile>>;
    stagedActions: IAllTeams<Array<IGameAction>>;
    state: IGameState;
    teams: IAllTeams<IBoardTeamMetadata>;
    turnNumber: number;
    version: CURRENT_GAME_STATE_VERSION;
}
