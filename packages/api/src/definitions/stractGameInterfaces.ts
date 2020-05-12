export type IStractGamePieceType = "circle" | "triangle" | "square";

export interface IStractGamePiece {
    isHidden: boolean;
    ownedByTeam: string;
    type: IStractGamePieceType;
}

export interface IStractGameTile {
    type: "free";
    occupiedBy?: IStractGamePiece;
}

export interface IStractGame {
    metadata: {
        name: string;
        boardSize: {
            x: number;
            y: number;
        };
    };
    board: Array<Array<IStractGameTile>>;
}
