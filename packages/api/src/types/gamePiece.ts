import { IGamePieceId, ITeamRid } from "./idTypes";

export type IGamePieceType = "circle" | "triangle" | "square";

export interface IGeneralGamePiece {
    id: IGamePieceId;
    isHidden: boolean;
    ownedByTeam: ITeamRid;
    type: IGamePieceType;
}

export interface IGamePieceCircle extends IGeneralGamePiece {
    type: "circle";
}

export interface IGamePieceTriangle extends IGeneralGamePiece {
    type: "triangle";
}

export interface IGamePieceSquare extends IGeneralGamePiece {
    type: "square";
}

export type IGamePiece = IGamePieceCircle | IGamePieceTriangle | IGamePieceSquare;

interface IGamePieceVisitor<Output> {
    circle: (gamePiece: IGamePieceCircle) => Output;
    triangle: (gamePiece: IGamePieceTriangle) => Output;
    square: (gamePiece: IGamePieceSquare) => Output;
    unknown: (gamePiece: IGamePiece) => Output;
}

export namespace IGamePieceType {
    export const circle = (gamePiece: Omit<IGeneralGamePiece, "type">): IGamePieceCircle => ({
        ...gamePiece,
        type: "circle",
    });
    export const triangle = (gamePiece: Omit<IGeneralGamePiece, "type">): IGamePieceTriangle => ({
        ...gamePiece,
        type: "triangle",
    });
    export const square = (gamePiece: Omit<IGeneralGamePiece, "type">): IGamePieceSquare => ({
        ...gamePiece,
        type: "square",
    });

    export const isCircle = (gamePiece: IGamePiece): gamePiece is IGamePieceCircle => gamePiece.type === "circle";
    export const isTriangle = (gamePiece: IGamePiece): gamePiece is IGamePieceTriangle => gamePiece.type === "triangle";
    export const isSquare = (gamePiece: IGamePiece): gamePiece is IGamePieceSquare => gamePiece.type === "square";

    export const visit = <T = any>(gamePiece: IGamePiece, callbacks: IGamePieceVisitor<T>) => {
        if (isCircle(gamePiece)) {
            return callbacks.circle(gamePiece);
        }

        if (isTriangle(gamePiece)) {
            return callbacks.triangle(gamePiece);
        }

        if (isSquare(gamePiece)) {
            return callbacks.square(gamePiece);
        }

        return callbacks.unknown(gamePiece);
    };
}
