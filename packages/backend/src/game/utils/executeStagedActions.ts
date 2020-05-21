/* eslint-disable no-param-reassign */
import {
    IAllTeams,
    IGameAction,
    IGameActionMovePiece,
    IGameActionSpawnPiece,
    IGameActionSpecialMovePiece,
    IGameActionSwitchPlacesWithPiece,
    IGameTile,
    IOccupiedBy,
    IOccupiedByAlive,
    IStractGameV1,
    ITeamRid,
} from "@stract/api";
import {
    adjustColumnAndRowByDirection,
    adjustColumnAndRowByMultipleDirections,
    checkIsIndexInBounds,
    getAlivePieceOwnedByTeam,
    getGamePieceFromType,
} from "@stract/utils";
import _ from "lodash";

function movePieceToNewLocation(
    board: IGameTile[][],
    start: {
        row: number;
        column: number;
    },
    end: {
        row: number;
        column: number;
    },
    gamePiece: IOccupiedByAlive,
) {
    board[start.row][start.column].occupiedBy = board[start.row][start.column].occupiedBy.filter(
        p => p.piece.id !== gamePiece.piece.id,
    );

    board[end.row][end.column].occupiedBy = board[end.row][end.column].occupiedBy.concat(gamePiece);
}

function executeMovePiece(currentGameState: IStractGameV1, movePieceAction: IGameActionMovePiece, team: ITeamRid) {
    const { gamePieceId, startRow, startColumn, direction } = movePieceAction.movePiece;
    const gamePiece = getAlivePieceOwnedByTeam(currentGameState.board, startRow, startColumn, gamePieceId, team);
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

    movePieceToNewLocation(currentGameState.board, { row: startRow, column: startColumn }, { row, column }, gamePiece);
}

function executeSpawnPiece(
    currentGameState: IStractGameV1,
    spawnPieceAction: IGameActionSpawnPiece,
    team: ITeamRid,
    teamKey: keyof IAllTeams<any>,
) {
    const { column, row, pieceType } = spawnPieceAction.spawnPiece;

    currentGameState.board[row][column].occupiedBy = currentGameState.board[row][column].occupiedBy.concat(
        IOccupiedBy.alive({ piece: getGamePieceFromType(pieceType, team) }),
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
    const gamePiece = getAlivePieceOwnedByTeam(currentGameState.board, startRow, startColumn, gamePieceId, team);
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

    movePieceToNewLocation(currentGameState.board, { row: startRow, column: startColumn }, { row, column }, gamePiece);
}

function executeSwitchPlacesWithPiece(
    currentGameState: IStractGameV1,
    switchPlacesWithPiece: IGameActionSwitchPlacesWithPiece,
    team: ITeamRid,
) {
    const {
        gamePieceId,
        start: { row, column },
    } = switchPlacesWithPiece.switchPlaces;
    const gamePiece = getAlivePieceOwnedByTeam(currentGameState.board, row, column, gamePieceId, team);
    if (gamePiece === undefined) {
        // eslint-disable-next-line no-console
        console.error("Attempted to target a switch place with a piece not owned by the team.");
        return;
    }

    const startingPosition = switchPlacesWithPiece.switchPlaces.start;
    const targetPosition = adjustColumnAndRowByMultipleDirections(
        startingPosition.column,
        startingPosition.row,
        switchPlacesWithPiece.switchPlaces.directions,
    );
    const { isValid } = checkIsIndexInBounds(
        targetPosition.column,
        targetPosition.row,
        currentGameState.metadata.board,
    );
    if (!isValid) {
        // eslint-disable-next-line no-console
        console.error("Attempted to switch places to an invalid location.");
        return;
    }

    const targetTileHasAlivePieces = currentGameState.board[targetPosition.row][
        targetPosition.column
    ].occupiedBy.filter(IOccupiedBy.isAlive);
    if (targetTileHasAlivePieces.length === 0) {
        return;
    }

    // Earths only move themselves and all target tiles, so we need to first filter it out of the original tile
    currentGameState.board[startingPosition.row][startingPosition.column].occupiedBy = currentGameState.board[
        startingPosition.row
    ][startingPosition.column].occupiedBy.filter(piece => piece.piece.id !== gamePieceId);
    // Then we need to get all the pieces in the target tile
    const targetTiles = currentGameState.board[targetPosition.row][targetPosition.column].occupiedBy;
    // Then we set the target tile to just be occupied by the single earth tile
    currentGameState.board[targetPosition.row][targetPosition.column].occupiedBy = [gamePiece];
    // Then we add the target pieces to the starting tile
    currentGameState.board[startingPosition.row][startingPosition.column].occupiedBy.push(...targetTiles);
}

export function executeStagedActions(currentGameState: IStractGameV1) {
    const appendId = (action: IGameAction, teamKey: keyof IAllTeams<any>) => ({
        id: currentGameState.teams[teamKey].id,
        teamKey,
        action,
    });

    const allActions = currentGameState.stagedActions.north
        .map(action => appendId(action, "north"))
        .concat(currentGameState.stagedActions.south.map(action => appendId(action, "south")))
        .sort((a, b) => {
            if (IGameAction.isSwitchPlacesWithPiece(a.action) && !IGameAction.isSwitchPlacesWithPiece(b.action)) {
                return 1;
            }

            if (IGameAction.isSwitchPlacesWithPiece(b.action) && !IGameAction.isSwitchPlacesWithPiece(a.action)) {
                return -1;
            }

            return a.action.timestamp > b.action.timestamp ? 1 : -1;
        });

    allActions.forEach(actionWithTeam => {
        IGameAction.visit(actionWithTeam.action, {
            movePiece: mp => executeMovePiece(currentGameState, mp, actionWithTeam.id),
            spawnPiece: sp => executeSpawnPiece(currentGameState, sp, actionWithTeam.id, actionWithTeam.teamKey),
            specialMovePiece: sm => executeSpecialMovePiece(currentGameState, sm, actionWithTeam.id),
            switchPlacesWithPiece: sw => executeSwitchPlacesWithPiece(currentGameState, sw, actionWithTeam.id),
            unknown: _.noop,
        });
    });

    currentGameState.stagedActions.north = [];
    currentGameState.stagedActions.south = [];
}
