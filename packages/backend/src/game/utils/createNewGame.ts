import {
    IBoardTeamPiecePool,
    IGameTile,
    IStractGameV1,
    stractBoardId,
    teamId,
    CURRENT_GAME_STATE_VERSION,
    IGameState,
} from "@stract/api";
import _ from "lodash";
import { v4 } from "uuid";

function createBoard(x: number, y: number): IGameTile[][] {
    return _.range(0, x).map(() => _.range(0, y).map(() => IGameTile.free({})));
}

const startingPiecePool: IBoardTeamPiecePool[] = [
    { total: 10, type: "triangle" },
    { total: 10, type: "circle" },
    { total: 10, type: "square" },
];

function startingTeam(teamName: string) {
    return {
        id: teamId(v4()),
        name: teamName,
        piecePool: {
            available: startingPiecePool,
            total: startingPiecePool,
        },
        players: [],
        score: 0,
    };
}

export function createNewGame(options: {
    roomName: string;
    timePerTurnInSeconds: number;
    totalTurns: number;
}): IStractGameV1 {
    const { roomName, timePerTurnInSeconds, totalTurns } = options;

    return {
        metadata: {
            board: {
                size: {
                    columns: 10,
                    rows: 10,
                },
            },
            id: stractBoardId(v4()),
            roomName,
            turns: {
                timePerTurnInSeconds,
                totalTurns,
            },
        },
        board: createBoard(10, 10),
        stagedActions: {
            north: [],
            south: [],
        },
        state: IGameState.notStarted(),
        teams: {
            north: startingTeam("North team"),
            south: startingTeam("South team"),
        },
        turnNumber: 1,
        version: CURRENT_GAME_STATE_VERSION,
    };
}
