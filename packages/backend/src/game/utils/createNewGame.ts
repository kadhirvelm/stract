import {
    IBoardTeamPiecePool,
    IGameTile,
    IStractGameV1,
    stractBoardId,
    teamId,
    CURRENT_GAME_STATE_VERSION,
    IGameState,
    IBoardMetadata,
} from "@stract/api";
import _ from "lodash";
import { v4 } from "uuid";

const BOARD_SIZE: IBoardMetadata = {
    size: {
        columns: 6,
        rows: 6,
    },
};

export function createBoard(x: number, y: number): IGameTile[][] {
    return _.range(0, x).map(() => _.range(0, y).map(() => IGameTile.free({ occupiedBy: [] })));
}

const startingPiecePool: IBoardTeamPiecePool[] = [
    { total: 10, type: "water" },
    { total: 10, type: "fire" },
    { total: 10, type: "earth" },
];

function startingTeam(teamName: string) {
    return {
        id: teamId(v4()),
        name: teamName,
        piecePool: {
            available: _.cloneDeep(startingPiecePool),
            total: _.cloneDeep(startingPiecePool),
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
            board: BOARD_SIZE,
            id: stractBoardId(v4()),
            roomName,
            turns: {
                timePerTurnInSeconds,
                totalTurns,
            },
        },
        board: createBoard(BOARD_SIZE.size.rows, BOARD_SIZE.size.columns),
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
