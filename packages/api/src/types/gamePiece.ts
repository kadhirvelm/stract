import { ITeamRid } from "./team";
import { Brand, createBrandedGeneric } from "../common";

export type IGamePieceId = Brand<string, "game-piece">;
export const gamePieceId = createBrandedGeneric<string, IGamePieceId>();

export type IGamePieceType = "circle" | "triangle" | "square";
export interface IGamePiece {
    id: IGamePieceId;
    isHidden: boolean;
    ownedByTeam: ITeamRid;
    type: IGamePieceType;
}
