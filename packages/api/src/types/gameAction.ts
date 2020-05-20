import { v4 } from "uuid";
import { IDirection } from "./general";
import { gameActionId, IGameActionId, IGamePieceId, IPlayerIdentifier } from "./idTypes";
import { IGamePieceType } from "./gamePiece";

export type IGameActionType = "move-piece" | "spawn-piece" | "special-move-piece" | "switch-places";

/**
 * All actions minimum.
 */
interface IGenericGameAction {
    addedByPlayer?: IPlayerIdentifier;
    id: IGameActionId;
    timestamp: number;
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
 * Switching places with a piece.
 */

export interface ISwitchPlacesWithPiece {
    gamePieceId: IGamePieceId;
    start: {
        row: number;
        column: number;
    };
    directions: [IDirection, IDirection] | [IDirection];
}

export interface IGameActionSwitchPlacesWithPiece extends IGenericGameAction {
    switchPlaces: ISwitchPlacesWithPiece;
    type: "switch-places";
}

/**
 * All actions.
 */

export type IGameAction =
    | IGameActionMovePiece
    | IGameActionSpawnPiece
    | IGameActionSpecialMovePiece
    | IGameActionSwitchPlacesWithPiece;

/**
 * GameAction namespace.
 */
interface IGameActionVisitor<Output = any> {
    movePiece: (gameAction: IGameActionMovePiece) => Output;
    spawnPiece: (gameAction: IGameActionSpawnPiece) => Output;
    specialMovePiece: (gameAction: IGameActionSpecialMovePiece) => Output;
    switchPlacesWithPiece: (gameAction: IGameActionSwitchPlacesWithPiece) => Output;
    unknown: (gameAction: IGameAction) => Output;
}

export namespace IGameAction {
    /**
     * Instantiators
     */

    export const movePiece = (newMovePiece: IMovePiece): IGameActionMovePiece => ({
        id: gameActionId(v4()),
        type: "move-piece",
        timestamp: new Date().valueOf(),
        movePiece: newMovePiece,
    });

    export const spawnPiece = (newSpawnPiece: ISpawnPiece): IGameActionSpawnPiece => ({
        id: gameActionId(v4()),
        spawnPiece: newSpawnPiece,
        timestamp: new Date().valueOf(),
        type: "spawn-piece",
    });

    export const specialMove = (newSpecialMove: ISpecialMovePiece): IGameActionSpecialMovePiece => ({
        id: gameActionId(v4()),
        specialMove: newSpecialMove,
        timestamp: new Date().valueOf(),
        type: "special-move-piece",
    });

    export const switchPlacesWithPiece = (
        newSwitchPlaces: ISwitchPlacesWithPiece,
    ): IGameActionSwitchPlacesWithPiece => ({
        id: gameActionId(v4()),
        switchPlaces: newSwitchPlaces,
        timestamp: new Date().valueOf(),
        type: "switch-places",
    });

    /**
     * Type guards
     */

    export const isMovePiece = (action: IGameAction): action is IGameActionMovePiece => action.type === "move-piece";

    export const isSpawnPiece = (action: IGameAction): action is IGameActionSpawnPiece => action.type === "spawn-piece";

    export const isSpecialMovePiece = (action: IGameAction): action is IGameActionSpecialMovePiece =>
        action.type === "special-move-piece";

    export const isSwitchPlacesWithPiece = (action: IGameAction): action is IGameActionSwitchPlacesWithPiece =>
        action.type === "switch-places";

    /**
     * Visitor
     */
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

        if (isSwitchPlacesWithPiece(action)) {
            return callbacks.switchPlacesWithPiece(action);
        }

        return callbacks.unknown(action);
    };
}
