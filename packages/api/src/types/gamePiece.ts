import { v4 } from "uuid";
import { IGamePieceId, ITeamRid, gamePieceId } from "./idTypes";

export type IGamePieceType = "fire" | "water" | "earth";

export interface IGeneralGamePiece {
    id: IGamePieceId;
    isHidden: boolean;
    ownedByTeam: ITeamRid;
    type: IGamePieceType;
}

export interface IGamePieceFire extends IGeneralGamePiece {
    type: "fire";
}

export interface IGamePieceWater extends IGeneralGamePiece {
    type: "water";
}

export interface IGamePieceEarth extends IGeneralGamePiece {
    type: "earth";
}

export type IGamePiece = IGamePieceFire | IGamePieceWater | IGamePieceEarth;

interface IGamePieceVisitor<Output> {
    fire: (gamePiece: IGamePieceFire) => Output;
    water: (gamePiece: IGamePieceWater) => Output;
    earth: (gamePiece: IGamePieceEarth) => Output;
    unknown: (gamePiece: IGamePiece) => Output;
}

export namespace IGamePiece {
    export const fire = (gamePiece: Omit<IGeneralGamePiece, "type" | "id">): IGamePieceFire => ({
        ...gamePiece,
        id: gamePieceId(v4()),
        type: "fire",
    });
    export const water = (gamePiece: Omit<IGeneralGamePiece, "type" | "id">): IGamePieceWater => ({
        ...gamePiece,
        id: gamePieceId(v4()),
        type: "water",
    });
    export const earth = (gamePiece: Omit<IGeneralGamePiece, "type" | "id">): IGamePieceEarth => ({
        ...gamePiece,
        id: gamePieceId(v4()),
        type: "earth",
    });

    export const isFire = (gamePiece: IGamePiece): gamePiece is IGamePieceFire => gamePiece.type === "fire";
    export const isWater = (gamePiece: IGamePiece): gamePiece is IGamePieceWater => gamePiece.type === "water";
    export const isEarth = (gamePiece: IGamePiece): gamePiece is IGamePieceEarth => gamePiece.type === "earth";

    export const visit = <T = any>(gamePiece: IGamePiece, callbacks: IGamePieceVisitor<T>) => {
        if (isFire(gamePiece)) {
            return callbacks.fire(gamePiece);
        }

        if (isWater(gamePiece)) {
            return callbacks.water(gamePiece);
        }

        if (isEarth(gamePiece)) {
            return callbacks.earth(gamePiece);
        }

        return callbacks.unknown(gamePiece);
    };
}
