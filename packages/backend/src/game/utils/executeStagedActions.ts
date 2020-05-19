/* eslint-disable no-param-reassign */
import {
    IGameAction,
    IGameActionMovePiece,
    IGameActionSpawnPiece,
    IStractGameV1,
    ITeamRid,
    IAllTeams,
} from "@stract/api";
import { getGamePieceFromType, checkIsIndexInBounds, adjustColumnAndRowByDirection } from "@stract/utils";
import _ from "lodash";

function executeMovePiece(currentGameState: IStractGameV1, movePieceAction: IGameActionMovePiece, team: ITeamRid) {
    const { gamePieceId, startRow, startColumn, direction } = movePieceAction.movePiece;

    const gamePiece = currentGameState.board[startRow][startColumn].occupiedBy.find(p => p.id === gamePieceId);
    if (gamePiece === undefined || gamePiece.ownedByTeam !== team) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece not owned by a team.");
        return;
    }

    currentGameState.board[startRow][startColumn].occupiedBy = currentGameState.board[startRow][
        startColumn
    ].occupiedBy.filter(p => p.id !== gamePieceId);

    const { column, row } = adjustColumnAndRowByDirection(startColumn, startRow, direction);
    const { isValid } = checkIsIndexInBounds(column, row, currentGameState.metadata.board);
    if (!isValid) {
        // eslint-disable-next-line no-console
        console.error("Attempted to move a piece to an invalid location.");
        return;
    }

    currentGameState.board[row][column].occupiedBy = currentGameState.board[row][column].occupiedBy.concat(gamePiece);
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
            unknown: _.noop,
        });
    });

    currentGameState.stagedActions.north = [];
    currentGameState.stagedActions.south = [];
}
