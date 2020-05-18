import {
    IStractGameV1,
    IGameAction,
    IGameActionMovePiece,
    IAllTeams,
    IGameActionSpawnPiece,
    IBoardMetadata,
    ITeamRid,
} from "@stract/api";
import { adjustColumnAndRowByDirection } from "./adjustColumnAndRowByDirection";
import { getTeamKeyFromRid } from "./getTeamKeyFromRid";

function checkIsIndexInBounds(columnIndex: number, rowIndex: number, gameBoardMetadata: IBoardMetadata) {
    if (columnIndex < 0 || columnIndex > gameBoardMetadata.size.columns) {
        return {
            isValid: false,
            message: `The column your action goes to, ${columnIndex}, is out of bounds. Please try again.`,
        };
    }

    if (rowIndex < 0 || rowIndex > gameBoardMetadata.size.rows) {
        return {
            isValid: false,
            message: `The row your action goes to, ${rowIndex}, is out of bounds. Please try again.`,
        };
    }

    return { isValid: true };
}

function isValidMoveAction(
    gameBoard: IStractGameV1,
    moveAction: IGameActionMovePiece,
    team: keyof IAllTeams<any>,
): IInvalidStagedAction {
    const existingStagedActions = gameBoard.stagedActions[team];
    const doAnyExistingStagedActionsMoveTheSamePiece = existingStagedActions.find(a => {
        return IGameAction.isMovePiece(a) && a.movePiece.gamePieceId === moveAction.movePiece.gamePieceId;
    });

    if (doAnyExistingStagedActionsMoveTheSamePiece !== undefined) {
        return {
            isValid: false,
            message: "Unfortunately a teammate is already moving the same piece. Try adding a different action.",
        };
    }

    const { column, row } = adjustColumnAndRowByDirection(
        moveAction.movePiece.startColumn,
        moveAction.movePiece.startRow,
        moveAction.movePiece.direction,
    );

    return checkIsIndexInBounds(column, row, gameBoard.metadata.board);
}

function isValidSpawnAction(
    gameBoard: IStractGameV1,
    spawnAction: IGameActionSpawnPiece,
    team: keyof IAllTeams<any>,
): IInvalidStagedAction {
    const expectedRowIndex = team === "north" ? 0 : gameBoard.metadata.board.size.rows - 1;
    if (spawnAction.spawnPiece.row !== expectedRowIndex) {
        return {
            isValid: false,
            message: `Your team (${team}) can only spawn in row ${expectedRowIndex}, but your spawn happened in row ${spawnAction.spawnPiece.row}. This is invalid, please try again.`,
        };
    }

    return checkIsIndexInBounds(spawnAction.spawnPiece.column, spawnAction.spawnPiece.row, gameBoard.metadata.board);
}

export interface IInvalidStagedAction {
    message?: string;
    isValid: boolean;
}

export function isValidStagedAction(
    gameBoard: IStractGameV1,
    newStagedAction: IGameAction,
    teamRid: ITeamRid,
): IInvalidStagedAction {
    const team = getTeamKeyFromRid(teamRid, gameBoard.teams);

    return IGameAction.visit<IInvalidStagedAction>(newStagedAction, {
        movePiece: mp => isValidMoveAction(gameBoard, mp, team),
        spawnPiece: sp => isValidSpawnAction(gameBoard, sp, team),
        unknown: () => ({ isValid: false, message: `Unexpected action type: ${newStagedAction.type}` }),
    });
}
