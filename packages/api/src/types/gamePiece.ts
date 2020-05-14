import { IGamePieceId, ITeamRid } from "./idTypes";

export type IGamePieceType = "circle" | "triangle" | "square";
export interface IGamePiece {
    id: IGamePieceId;
    isHidden: boolean;
    ownedByTeam: ITeamRid;
    type: IGamePieceType;
}
