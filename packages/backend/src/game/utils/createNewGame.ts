import { IGameTile, IStractGameV1, stractBoardId, teamId, IBoardTeamPiecePool } from "@stract/api";
import _ from "lodash";
import { v4 } from "uuid";

function createBoard(x: number, y: number): IGameTile[][] {
    return _.range(0, x).map(() => _.range(0, y).map(() => ({ type: "free" })));
}

const startingPiecePool: IBoardTeamPiecePool[] = [
    { total: 10, type: "triangle" },
    { total: 10, type: "circle" },
    { total: 10, type: "square" },
];

export function createNewGame(): IStractGameV1 {
    return {
        metadata: {
            board: {
                size: {
                    columns: 10,
                    rows: 10,
                },
            },
            id: stractBoardId(v4()),
            roomName: "Sample game board",
        },
        board: createBoard(10, 10),
        stagedActions: {
            north: [],
            south: [],
        },
        teams: {
            north: {
                id: teamId(v4()),
                name: "North team",
                piecePool: {
                    available: startingPiecePool,
                    total: startingPiecePool,
                },
                players: [],
            },
            south: {
                id: teamId(v4()),
                name: "South team",
                piecePool: {
                    available: startingPiecePool,
                    total: startingPiecePool,
                },
                players: [],
            },
        },
        turnNumber: 1,
    };
}
