import { v4 } from "uuid";
import { IDirection } from "./general";
import { gamePieceId, IGamePieceId, ITeamRid } from "./idTypes";

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

export namespace ISpecialActions {
    export const fire = (direction: IDirection): [IDirection, IDirection] => {
        return [direction, direction];
    };

    export const earth = (directions: IDirection[]): [IDirection] | [IDirection, IDirection] => {
        if (directions.length === 0 || directions.length > 2) {
            throw new Error(`Invalid earth movement, you need at least 1 and at most 2: ${directions}`);
        }

        if (
            (directions.includes("west") && directions.includes("east")) ||
            (directions.includes("north") && directions.includes("south"))
        ) {
            throw new Error(`Earth cannot include opposite directions: ${directions}`);
        }

        return directions as [IDirection] | [IDirection, IDirection];
    };

    export const water = (topOrBottom: "north" | "south", leftOrRight: "east" | "west"): [IDirection, IDirection] => {
        return [topOrBottom, leftOrRight];
    };
}
