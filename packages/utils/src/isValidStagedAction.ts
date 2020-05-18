import {
    IAllTeams,
    IGameAction,
    IGameActionMovePiece,
    IGameActionSpawnPiece,
    IStractGameV1,
    ITeamRid,
} from "@stract/api";
import { adjustColumnAndRowByDirection } from "./adjustColumnAndRowByDirection";
import { getTeamKeyFromRid } from "./getTeamKeyFromRid";
import { checkIsIndexInBounds } from "./checkIsIndexInBounds";

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

    const availablePiecesOfType = gameBoard.teams[team].piecePool.available.find(
        piece => piece.type === spawnAction.spawnPiece.pieceType,
    );
    if (availablePiecesOfType === undefined || availablePiecesOfType.total === 0) {
        return {
            isValid: false,
            message: `Your team does not have any more piece of type ${spawnAction.spawnPiece.pieceType} left. Try spawning a different piece.`,
        };
    }

    const otherStagedActionsSpawningSamePiece = gameBoard.stagedActions[team].filter(action => IGameAction.isSpawnPiece(action) && action.spawnPiece.pieceType === spawnAction.spawnPiece.pieceType);
    if ((availablePiecesOfType.total - otherStagedActionsSpawningSamePiece.length) <= 0) {
        return {
            isValid: false,
            message: `Your teammate is also spawning a ${spawnAction.spawnPiece.pieceType}, which causes your team to run out. Try spawning a different piece.`;
        }
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
