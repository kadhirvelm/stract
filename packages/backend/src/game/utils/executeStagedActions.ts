/* eslint-disable no-param-reassign */
import { IGameAction, IGameActionMovePiece, IGameActionSpawnPiece, IStractGameV1, ITeamRid } from "@stract/api";
import { getGamePieceFromType, checkIsIndexInBounds, adjustColumnAndRowByDirection } from "@stract/utils";
import _ from "lodash";

function executeMovePiece(currentGameState: IStractGameV1, movePieceAction: IGameActionMovePiece, team: ITeamRid) {
    const { gamePieceId, startRow, startColumn, direction } = movePieceAction.movePiece;

    const gamePiece = currentGameState.board[startRow][startColumn].occupiedBy?.find(p => p.id === gamePieceId);
    if (gamePiece === undefined || gamePiece.ownedByTeam !== team) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece not owned by a team.");
        return;
    }

    currentGameState.board[startRow][startColumn].occupiedBy = currentGameState.board[startRow][
        startColumn
    ].occupiedBy?.filter(p => p.id !== gamePieceId);

    const { column, row } = adjustColumnAndRowByDirection(startColumn, startRow, direction);
    const { isValid } = checkIsIndexInBounds(column, row, currentGameState.metadata.board);
    if (!isValid) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece to an invalid location.");
        return;
    }

    currentGameState.board[row][column].occupiedBy = (currentGameState.board[row][column].occupiedBy ?? []).concat(
        gamePiece,
    );
}

function executeSpawnPiece(currentGameState: IStractGameV1, spawnPieceAction: IGameActionSpawnPiece, team: ITeamRid) {
    const { column, row, pieceType } = spawnPieceAction.spawnPiece;

    currentGameState.board[row][column].occupiedBy = (currentGameState.board[row][column].occupiedBy ?? []).concat(
        getGamePieceFromType(pieceType, team),
    );
}

export function executeStagedActions(currentGameState: IStractGameV1) {
    const northTeamRid = currentGameState.teams.north.id;
    const southTeamRid = currentGameState.teams.south.id;

    const appendNorthId = (action: IGameAction) => ({ id: northTeamRid, action });
    const appendSouthId = (action: IGameAction) => ({ id: southTeamRid, action });

    const allActions = currentGameState.stagedActions.north
        .map(appendNorthId)
        .concat(currentGameState.stagedActions.south.map(appendSouthId));

    allActions.forEach(actionWithTeam => {
        IGameAction.visit(actionWithTeam.action, {
            movePiece: mp => executeMovePiece(currentGameState, mp, actionWithTeam.id),
            spawnPiece: sp => executeSpawnPiece(currentGameState, sp, actionWithTeam.id),
            unknown: _.noop,
        });
    });

    currentGameState.stagedActions.north = [];
    currentGameState.stagedActions.south = [];
}
