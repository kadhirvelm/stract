import { v4 } from "uuid";
import { IDirection } from "./general";
import { gameActionId, IGameActionId, IGamePieceId, IPlayerIdentifier } from "./idTypes";

export type IGameActionType = "move-piece" | "spawn-piece" | "special-move-piece";

/**
 * All actions minimum.
 */
interface IGenericGameAction {
    addedByPlayer?: IPlayerIdentifier;
    id: IGameActionId;
    type: IGameActionType;
}

export interface IGenericMovePiece {
    gamePieceId: IGamePieceId;
    startRow: number;
    startColumn: number;
}

/**
 * Moving a basic piece.
 */

export interface IMovePiece extends IGenericMovePiece {
    direction: IDirection;
}

export interface IGameActionMovePiece extends IGenericGameAction {
    movePiece: IMovePiece;
    type: "move-piece";
}

/**
 * Spawning a new piece.
 */

export interface ISpawnPiece {
    column: number;
    row: number;
    pieceType: IGamePieceType;
}

export interface IGameActionSpawnPiece extends IGenericGameAction {
    spawnPiece: ISpawnPiece;
    type: "spawn-piece";
}

/**
 * Moving a basic piece.
 */

export interface ISpecialMovePiece extends IGenericMovePiece {
    directions: [IDirection, IDirection];
}

export interface IGameActionSpecialMovePiece extends IGenericGameAction {
    specialMove: ISpecialMovePiece;
    type: "special-move-piece";
}

/**
 * All actions.
 */

export type IGameAction = IGameActionMovePiece | IGameActionSpawnPiece | IGameActionSpecialMovePiece;

/**
 * GameAction namespace.
 */
interface IGameActionVisitor<Output = any> {
    movePiece: (gameAction: IGameActionMovePiece) => Output;
    spawnPiece: (gameAction: IGameActionSpawnPiece) => Output;
    specialMovePiece: (gameAction: IGameActionSpecialMovePiece) => Output;
    unknown: (gameAction: IGameAction) => Output;
}

export namespace IGameAction {
    export const movePiece = (newMovePiece: IMovePiece): IGameActionMovePiece => ({
        id: gameActionId(v4()),
        type: "move-piece",
        movePiece: newMovePiece,
    });

    export const spawnPiece = (newSpawnPiece: ISpawnPiece): IGameActionSpawnPiece => ({
        id: gameActionId(v4()),
        type: "spawn-piece",
        spawnPiece: newSpawnPiece,
    });

    export const specialMove = (newSpecialMove: ISpecialMovePiece): IGameActionSpecialMovePiece => ({
        id: gameActionId(v4()),
        type: "special-move-piece",
        specialMove: newSpecialMove,
    });

    export const isMovePiece = (action: IGameAction): action is IGameActionMovePiece => action.type === "move-piece";

    export const isSpawnPiece = (action: IGameAction): action is IGameActionSpawnPiece => action.type === "spawn-piece";

    export const isSpecialMovePiece = (action: IGameAction): action is IGameActionSpecialMovePiece =>
        action.type === "special-move-piece";

    export const visit = <T = any>(action: IGameAction, callbacks: IGameActionVisitor<T>) => {
        if (isMovePiece(action)) {
            return callbacks.movePiece(action);
        }

        if (isSpawnPiece(action)) {
            return callbacks.spawnPiece(action);
        }

        if (isSpecialMovePiece(action)) {
            return callbacks.specialMovePiece(action);
        }

        return callbacks.unknown(action);
    };
}
