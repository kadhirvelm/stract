/* eslint-disable no-param-reassign */
import {
    IGameAction,
    IGameActionMovePiece,
    IGameActionSpawnPiece,
    IStractGameV1,
    ITeamRid,
    IAllTeams,
    IGameActionSpecialMovePiece,
    IGameTile,
    IGamePieceId,
    IGamePiece,
} from "@stract/api";
import {
    getGamePieceFromType,
    checkIsIndexInBounds,
    adjustColumnAndRowByDirection,
    adjustColumnAndRowByMultipleDirections,
} from "@stract/utils";
import _ from "lodash";

function getPieceOwnedByTeam(
    board: IGameTile[][],
    row: number,
    column: number,
    gamePieceId: IGamePieceId,
    ownedByTeam: ITeamRid,
) {
    const gamePiece = board[row][column].occupiedBy.find(p => p.id === gamePieceId);
    if (gamePiece === undefined || gamePiece.ownedByTeam !== ownedByTeam) {
        return undefined;
    }

    return gamePiece;
}

function movePieceToNewLocation(
    board: IGameTile[][],
    startRow: number,
    startColumn: number,
    newRow: number,
    newColumn: number,
    gamePiece: IGamePiece,
) {
    board[startRow][startColumn].occupiedBy = board[startRow][startColumn].occupiedBy.filter(
        p => p.id !== gamePiece.id,
    );

    board[newRow][newColumn].occupiedBy = board[newRow][newColumn].occupiedBy.concat(gamePiece);
}

function executeMovePiece(currentGameState: IStractGameV1, movePieceAction: IGameActionMovePiece, team: ITeamRid) {
    const { gamePieceId, startRow, startColumn, direction } = movePieceAction.movePiece;
    const gamePiece = getPieceOwnedByTeam(currentGameState.board, startRow, startColumn, gamePieceId, team);
    if (gamePiece === undefined) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece not owned by a team.");
        return;
    }

    const { column, row } = adjustColumnAndRowByDirection(startColumn, startRow, direction);
    const { isValid } = checkIsIndexInBounds(column, row, currentGameState.metadata.board);
    if (!isValid) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece to an invalid location.");
        return;
    }

    movePieceToNewLocation(currentGameState.board, startRow, startColumn, column, row, gamePiece);
}

function executeSpawnPiece(
    currentGameState: IStractGameV1,
    spawnPieceAction: IGameActionSpawnPiece,
    team: ITeamRid,
    teamKey: keyof IAllTeams<any>,
) {
    const { column, row, pieceType } = spawnPieceAction.spawnPiece;

    currentGameState.board[row][column].occupiedBy = currentGameState.board[row][column].occupiedBy.concat(
        getGamePieceFromType(pieceType, team),
    );

    currentGameState.teams[teamKey].piecePool.available = currentGameState.teams[teamKey].piecePool.available.map(
        piece => {
            if (piece.type === pieceType) {
                piece.total -= 1;
            }

            return piece;
        },
    );
}

function executeSpecialMovePiece(
    currentGameState: IStractGameV1,
    specialMovePiece: IGameActionSpecialMovePiece,
    team: ITeamRid,
) {
    const { gamePieceId, startRow, startColumn, directions } = specialMovePiece.specialMove;
    const gamePiece = getPieceOwnedByTeam(currentGameState.board, startRow, startColumn, gamePieceId, team);
    if (gamePiece === undefined) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece not owned by a team.");
        return;
    }

    const { column, row } = adjustColumnAndRowByMultipleDirections(startColumn, startRow, directions);
    const { isValid } = checkIsIndexInBounds(column, row, currentGameState.metadata.board);
    if (!isValid) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece to an invalid location.");
        return;
    }

    movePieceToNewLocation(currentGameState.board, startRow, startColumn, column, row, gamePiece);
}

export function executeStagedActions(currentGameState: IStractGameV1) {
    const appendId = (action: IGameAction, teamKey: keyof IAllTeams<any>) => ({
        id: currentGameState.teams[teamKey].id,
        teamKey,
        action,
    });

    const allActions = currentGameState.stagedActions.north
        .map(action => appendId(action, "north"))
        .concat(currentGameState.stagedActions.south.map(action => appendId(action, "south")));

    allActions.forEach(actionWithTeam => {
        IGameAction.visit(actionWithTeam.action, {
            movePiece: mp => executeMovePiece(currentGameState, mp, actionWithTeam.id),
            spawnPiece: sp => executeSpawnPiece(currentGameState, sp, actionWithTeam.id, actionWithTeam.teamKey),
            specialMovePiece: sm => executeSpecialMovePiece(currentGameState, sm, actionWithTeam.id),
            unknown: _.noop,
        });
    });

    currentGameState.stagedActions.north = [];
    currentGameState.stagedActions.south = [];
}
