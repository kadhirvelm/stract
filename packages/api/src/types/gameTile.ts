import { IOccupiedBy } from "./occupiedBy";

export type IGameTileType = "free";

export interface IGeneralGameTile {
    type: IGameTileType;
    occupiedBy: IOccupiedBy[];
}

export interface IGameTileFree extends IGeneralGameTile {
    type: "free";
}

export type IGameTile = IGameTileFree;

interface IGameTileVisitor<Output> {
    free: (gameTile: IGameTileFree) => Output;
    unknown: (gameTile: IGameTile) => Output;
}

export namespace IGameTile {
    export const free = (gameTile: Omit<IGeneralGameTile, "type">): IGameTileFree => ({ ...gameTile, type: "free" });

    export const isFree = (gameTile: IGameTile): gameTile is IGameTileFree => gameTile.type === "free";

    export const visit = <T = any>(gameTile: IGameTile, callbacks: IGameTileVisitor<T>) => {
        if (isFree(gameTile)) {
            return callbacks.free(gameTile);
        }

        return callbacks.unknown(gameTile);
    };
}
