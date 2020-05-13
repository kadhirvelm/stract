import { v4 } from "uuid";
import { IGamePieceId, IGamePieceType } from "./gamePiece";
import { Brand, createBrandedGeneric } from "../common";

export type IGameActionId = Brand<string, "game-action-id">;
export const gameActionId = createBrandedGeneric<string, IGameActionId>();

/**
 * All actions minimum.
 */
interface IGenericGameAction {
    id: IGameActionId;
    type: string;
}

/**
 * Valid directions to push a piece in.
 */
export type IDirection = "north" | "west" | "south" | "east";

/**
 * Moving a basic piece.
 */

export interface IMovePiece {
    gamePieceId: IGamePieceId;
    startRow: number;
    startColumn: number;
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
    startColumn: number;
    pieceType: IGamePieceType;
}

export interface IGameActionSpawnPiece extends IGenericGameAction {
    spawnPiece: ISpawnPiece;
    type: "spawn-piece";
}

/**
 * All actions.
 */

export type IGameAction = IGameActionMovePiece | IGameActionSpawnPiece;

/**
 * GameAction namespace.
 */
interface IVisitor<Output = any> {
    movePiece: (gameAction: IGameActionMovePiece) => Output;
    spawnPiece: (gameAction: IGameActionSpawnPiece) => Output;
    unknown: (gameAction: any) => Output;
}

export namespace IGameAction {
    /**
     * Instantiators
     */

    export const movePiece = (moveStractPiece: IMovePiece): IGameActionMovePiece => ({
        id: gameActionId(v4()),
        type: "move-piece",
        movePiece: moveStractPiece,
    });

    export const spawnPiece = (spawnStractPiece: ISpawnPiece): IGameActionSpawnPiece => ({
        id: gameActionId(v4()),
        type: "spawn-piece",
        spawnPiece: spawnStractPiece,
    });

    /**
     * Type guards
     */

    export const isMovePiece = (action: IGameAction): action is IGameActionMovePiece => {
        return action.type === "move-piece";
    };

    export const isSpawnPiece = (action: IGameAction): action is IGameActionSpawnPiece => {
        return action.type === "spawn-piece";
    };

    /**
     * Visitor
     */

    export const visit = <T = any>(action: IGameAction, callbacks: IVisitor<T>) => {
        if (isMovePiece(action)) {
            return callbacks.movePiece(action);
        }

        if (isSpawnPiece(action)) {
            return callbacks.spawnPiece(action);
        }

        return callbacks.unknown(action);
    };
}
