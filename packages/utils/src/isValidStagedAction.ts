import {
    IAllTeams,
    IGameAction,
    IGameActionMovePiece,
    IGameActionSpawnPiece,
    IStractGameV1,
    ITeamRid,
    IGameActionSpecialMovePiece,
    IGamePieceId,
    IGamePiece,
    IGameActionSwitchPlacesWithPiece,
} from "@stract/api";
import { adjustColumnAndRowByDirection, adjustColumnAndRowByMultipleDirections } from "./adjustColumnAndRowByDirection";
import { getTeamKeyFromRid } from "./getTeamKeyFromRid";
import { checkIsIndexInBounds } from "./checkIsIndexInBounds";
import { getPieceOwnedByTeam } from "./getGamePieceOwnedByTeam";

function doExistingStagedActionsAffectTheSamePiece(existingStagedActions: IGameAction[], gamePieceId: IGamePieceId) {
    return existingStagedActions.some(action =>
        IGameAction.visit<boolean>(action, {
            movePiece: mp => mp.movePiece.gamePieceId === gamePieceId,
            spawnPiece: () => false,
            specialMovePiece: sp => sp.specialMove.gamePieceId === gamePieceId,
            switchPlacesWithPiece: sw => sw.switchPlaces.gamePieceId === gamePieceId,
            unknown: () => false,
        }),
    );
}

function isValidMoveAction(
    gameBoard: IStractGameV1,
    moveAction: IGameActionMovePiece,
    team: keyof IAllTeams<any>,
    teamRid: ITeamRid,
): IInvalidStagedAction {
    const doExistingStagedActionsMoveTheSamePiece = doExistingStagedActionsAffectTheSamePiece(
        gameBoard.stagedActions[team],
        moveAction.movePiece.gamePieceId,
    );
    if (doExistingStagedActionsMoveTheSamePiece) {
        return {
            isValid: false,
            message: "Unfortunately a teammate is already moving the same piece. Try adding a different action.",
        };
    }

    const gamePiece = getPieceOwnedByTeam(
        gameBoard.board,
        moveAction.movePiece.startRow,
        moveAction.movePiece.startColumn,
        moveAction.movePiece.gamePieceId,
        teamRid,
    );
    if (gamePiece === undefined) {
        return {
            isValid: false,
            message: "Your team does not own a piece there. Try adding a different action.",
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
            message: `Your team (${team}) can only spawn in row ${expectedRowIndex}, but your spawn happened in row ${spawnAction.spawnPiece.row}. Please try again in row ${spawnAction.spawnPiece.row}.`,
        };
    }

    const availablePiecesOfType = gameBoard.teams[team].piecePool.available.find(
        piece => piece.type === spawnAction.spawnPiece.pieceType,
    );
    if (availablePiecesOfType === undefined || availablePiecesOfType.total === 0) {
        return {
            isValid: false,
            message: `Your team does not have any more ${spawnAction.spawnPiece.pieceType} pieces left. Try a different one?`,
        };
    }

    const doesAnExistingStagedActionAffectThePiece = gameBoard.stagedActions[team].some(
        a =>
            IGameAction.isSpawnPiece(a) &&
            a.spawnPiece.column === spawnAction.spawnPiece.column &&
            a.spawnPiece.row === spawnAction.spawnPiece.row,
    );
    if (doesAnExistingStagedActionAffectThePiece) {
        return {
            isValid: false,
            message: `Unfortunately another action is already spawing to ${spawnAction.spawnPiece.column}. Try a different location?`,
        };
    }

    const otherStagedActionsSpawningSamePiece = gameBoard.stagedActions[team].filter(
        action => IGameAction.isSpawnPiece(action) && action.spawnPiece.pieceType === spawnAction.spawnPiece.pieceType,
    );
    if (availablePiecesOfType.total - otherStagedActionsSpawningSamePiece.length <= 0) {
        return {
            isValid: false,
            message: `Another action is also spawning a ${spawnAction.spawnPiece.pieceType}, which causes your team to run out. Try a different piece?`,
        };
    }

    return checkIsIndexInBounds(spawnAction.spawnPiece.column, spawnAction.spawnPiece.row, gameBoard.metadata.board);
}

function isValidSpecialMoveAction(
    gameBoard: IStractGameV1,
    specialMoveAction: IGameActionSpecialMovePiece,
    team: keyof IAllTeams<any>,
    teamRid: ITeamRid,
): IInvalidStagedAction {
    const doesAnExistingStagedActionAffectThePiece = doExistingStagedActionsAffectTheSamePiece(
        gameBoard.stagedActions[team],
        specialMoveAction.specialMove.gamePieceId,
    );
    if (doesAnExistingStagedActionAffectThePiece) {
        return {
            isValid: false,
            message: "Unfortunately a teammate is already moving the same piece. Try adding a different action.",
        };
    }

    const { column, row } = adjustColumnAndRowByMultipleDirections(
        specialMoveAction.specialMove.startColumn,
        specialMoveAction.specialMove.startRow,
        specialMoveAction.specialMove.directions,
    );

    const columnDifference = Math.abs(specialMoveAction.specialMove.startColumn - column);
    const rowDifference = Math.abs(specialMoveAction.specialMove.startRow - row);

    const gamePiece = getPieceOwnedByTeam(
        gameBoard.board,
        specialMoveAction.specialMove.startRow,
        specialMoveAction.specialMove.startColumn,
        specialMoveAction.specialMove.gamePieceId,
        teamRid,
    );
    if (gamePiece === undefined) {
        return {
            isValid: false,
            message: "Your team does not own a piece in that location. Try adding a different action.",
        };
    }

    if (columnDifference + rowDifference !== 2) {
        return {
            isValid: false,
            message:
                "Special moves must compose of two directions that do not contradict each other. This is an invalid action.",
        };
    }

    if ((columnDifference === 2 || rowDifference === 2) && !IGamePiece.isFire(gamePiece)) {
        return {
            isValid: false,
            message: "Only fire tiles are allowed to move 2 in one direction. This is an invalid action.",
        };
    }

    if (columnDifference === 1 && rowDifference === 1 && !IGamePiece.isWater(gamePiece)) {
        return {
            isValid: false,
            message: "Only water tiles are allowed to move diagonally. This is an invalid action.",
        };
    }

    return checkIsIndexInBounds(column, row, gameBoard.metadata.board);
}

function isValidSwitchPlacesWithPieceAction(
    gameBoard: IStractGameV1,
    switchPlacesWithPieceAction: IGameActionSwitchPlacesWithPiece,
    team: keyof IAllTeams<any>,
    teamRid: ITeamRid,
) {
    const doesAnExistingStagedActionAffectThePiece = doExistingStagedActionsAffectTheSamePiece(
        gameBoard.stagedActions[team],
        switchPlacesWithPieceAction.switchPlaces.gamePieceId,
    );
    if (doesAnExistingStagedActionAffectThePiece) {
        return {
            isValid: false,
            message: "Unfortunately a teammate is already moving the same piece. Try adding a different action.",
        };
    }

    const { directions } = switchPlacesWithPieceAction.switchPlaces;
    if (
        (directions.includes("north") && directions.includes("south")) ||
        (directions.includes("east") && directions.includes("west"))
    ) {
        return {
            isValid: false,
            message: `This is an invalid switch action, it cannot contain opposite directions: ${directions}`,
        };
    }

    const gamePiece = getPieceOwnedByTeam(
        gameBoard.board,
        switchPlacesWithPieceAction.switchPlaces.start.row,
        switchPlacesWithPieceAction.switchPlaces.start.column,
        switchPlacesWithPieceAction.switchPlaces.gamePieceId,
        teamRid,
    );
    if (gamePiece === undefined) {
        return {
            isValid: false,
            message: "Your team does not own a piece in that location. Try a different location?",
        };
    }

    const targetPosition = adjustColumnAndRowByMultipleDirections(
        switchPlacesWithPieceAction.switchPlaces.start.column,
        switchPlacesWithPieceAction.switchPlaces.start.row,
        switchPlacesWithPieceAction.switchPlaces.directions,
    );

    return checkIsIndexInBounds(targetPosition.column, targetPosition.row, gameBoard.metadata.board);
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
        movePiece: mp => isValidMoveAction(gameBoard, mp, team, teamRid),
        spawnPiece: sp => isValidSpawnAction(gameBoard, sp, team),
        specialMovePiece: sm => isValidSpecialMoveAction(gameBoard, sm, team, teamRid),
        switchPlacesWithPiece: sw => isValidSwitchPlacesWithPieceAction(gameBoard, sw, team, teamRid),
        unknown: () => ({ isValid: false, message: `Unexpected action type: ${newStagedAction.type}` }),
    });
}
