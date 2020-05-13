import { IGameTile } from "./gameTile";
import { ITeamRid } from "./team";
import { IGameAction } from "./gameAction";
import { Brand, createBrandedGeneric } from "../common";

export interface IBoardMetadata {
    size: {
        columns: number;
        rows: number;
    };
}

export type IStractBoardId = Brand<string, "board-id">;
export const stractBoardId = createBrandedGeneric<string, IStractBoardId>();

export interface IBoardTeamMetadata {
    id: ITeamRid;
    name: string;
}

export interface IBoardStagedAction {
    ownedByTeam: ITeamRid;
}

export interface IStractGame {
    metadata: {
        board: IBoardMetadata;
        id: IStractBoardId;
        roomName: string;
        teams: {
            north: IBoardTeamMetadata;
            south: IBoardTeamMetadata;
        };
        turnNumber: number;
    };
    board: Array<Array<IGameTile>>;
    stagedActions: Array<IGameAction & IBoardStagedAction>;
}
