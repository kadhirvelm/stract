import { IGamePiece } from "./gamePiece";

export type IGameTileType = "free";
export interface IGameTile {
    type: IGameTileType;
    occupiedBy?: IGamePiece[];
}
