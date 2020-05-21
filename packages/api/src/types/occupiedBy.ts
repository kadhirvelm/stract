import { IGamePiece } from "./gamePiece";

export type IOccupiedByType = "alive" | "destroyed" | "scored";

export interface IGeneralOccupiedBy {
    piece: IGamePiece;
    type: IOccupiedByType;
}

export interface IOccupiedByAlive extends IGeneralOccupiedBy {
    type: "alive";
}

export interface IOccupiedByDestroyed extends IGeneralOccupiedBy {
    type: "destroyed";
}

export interface IOccupiedByScored extends IGeneralOccupiedBy {
    type: "scored";
}

export type IOccupiedBy = IOccupiedByAlive | IOccupiedByDestroyed | IOccupiedByScored;

interface IOccupiedByVisitor<Output> {
    alive: (occupiedBy: IOccupiedByAlive) => Output;
    destroyed: (occupiedBy: IOccupiedByDestroyed) => Output;
    scored: (occupiedBy: IOccupiedByScored) => Output;
    undefined: () => Output;
    unknown: (occupiedBy: IOccupiedBy) => Output;
}

export namespace IOccupiedBy {
    export const alive = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByAlive => ({
        ...occupiedBy,
        type: "alive",
    });
    export const destroyed = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByDestroyed => ({
        ...occupiedBy,
        piece: { ...occupiedBy.piece, isHidden: false },
        type: "destroyed",
    });
    export const scored = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByScored => ({
        ...occupiedBy,
        type: "scored",
    });

    export const isAlive = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByAlive => occupiedBy.type === "alive";
    export const isDestroyed = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByDestroyed =>
        occupiedBy.type === "destroyed";
    export const isScored = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByScored => occupiedBy.type === "scored";

    export const visit = <T = any>(occupiedBy: IOccupiedBy | undefined, callbacks: IOccupiedByVisitor<T>) => {
        if (occupiedBy === undefined) {
            return callbacks.undefined();
        }

        if (isAlive(occupiedBy)) {
            return callbacks.alive(occupiedBy);
        }

        if (isDestroyed(occupiedBy)) {
            return callbacks.destroyed(occupiedBy);
        }

        if (isScored(occupiedBy)) {
            return callbacks.scored(occupiedBy);
        }

        return callbacks.unknown(occupiedBy);
    };
}
