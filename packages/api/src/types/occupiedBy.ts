import { IGamePiece } from "./gamePiece";

export type IOccupiedByType = "alive" | "dead" | "scored";

export interface IGeneralOccupiedBy {
    piece: IGamePiece;
    type: IOccupiedByType;
}

export interface IOccupiedByAlive extends IGeneralOccupiedBy {
    type: "alive";
}

export interface IOccupiedByDead extends IGeneralOccupiedBy {
    type: "dead";
}

export interface IOccupiedByScored extends IGeneralOccupiedBy {
    type: "scored";
}

export type IOccupiedBy = IOccupiedByAlive | IOccupiedByDead | IOccupiedByScored;

interface IOccupiedByVisitor<Output> {
    alive: (occupiedBy: IOccupiedByAlive) => Output;
    dead: (occupiedBy: IOccupiedByDead) => Output;
    scored: (occupiedBy: IOccupiedByScored) => Output;
    undefined: () => Output;
    unknown: (occupiedBy: IOccupiedBy) => Output;
}

export namespace IOccupiedBy {
    export const alive = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByAlive => ({
        ...occupiedBy,
        type: "alive",
    });
    export const dead = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByDead => ({
        ...occupiedBy,
        piece: { ...occupiedBy.piece, isHidden: false },
        type: "dead",
    });
    export const scored = (occupiedBy: Omit<IGeneralOccupiedBy, "type">): IOccupiedByScored => ({
        ...occupiedBy,
        type: "scored",
    });

    export const isAlive = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByAlive => occupiedBy.type === "alive";
    export const isDead = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByDead => occupiedBy.type === "dead";
    export const isScored = (occupiedBy: IOccupiedBy): occupiedBy is IOccupiedByScored => occupiedBy.type === "scored";

    export const visit = <T = any>(occupiedBy: IOccupiedBy | undefined, callbacks: IOccupiedByVisitor<T>) => {
        if (occupiedBy === undefined) {
            return callbacks.undefined();
        }

        if (isAlive(occupiedBy)) {
            return callbacks.alive(occupiedBy);
        }

        if (isDead(occupiedBy)) {
            return callbacks.dead(occupiedBy);
        }

        if (isScored(occupiedBy)) {
            return callbacks.scored(occupiedBy);
        }

        return callbacks.unknown(occupiedBy);
    };
}
