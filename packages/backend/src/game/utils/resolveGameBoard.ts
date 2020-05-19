/* eslint-disable no-param-reassign */
import { IStractGameV1, IGamePiece, IGameTile } from "@stract/api";
import { getTeamKeyFromRid } from "@stract/utils";
import { POINT_VALUES } from "./pointValues";

function getWinningPiece(
    pieceOne: IGamePiece,
    pieceTwo: IGamePiece,
): { occupiedBy: IGamePiece[]; losingPieces: IGamePiece[] } {
    if (pieceOne.type === pieceTwo.type) {
        return { occupiedBy: [], losingPieces: [pieceOne, pieceTwo] };
    }

    if (IGamePiece.isCircle(pieceOne) && IGamePiece.isSquare(pieceTwo)) {
        return { occupiedBy: [{ ...pieceOne, isHidden: false }], losingPieces: [pieceTwo] };
    }

    if (IGamePiece.isSquare(pieceOne) && IGamePiece.isTriangle(pieceTwo)) {
        return { occupiedBy: [{ ...pieceOne, isHidden: false }], losingPieces: [pieceTwo] };
    }

    if (IGamePiece.isTriangle(pieceOne) && IGamePiece.isCircle(pieceTwo)) {
        return { occupiedBy: [{ ...pieceOne, isHidden: false }], losingPieces: [pieceTwo] };
    }

    return getWinningPiece(pieceTwo, pieceOne);
}

function removePiecesFromAvailablePool(losingPieces: IGamePiece[], currentGameState: IStractGameV1) {
    losingPieces.forEach(piece => {
        const teamKey = getTeamKeyFromRid(piece.ownedByTeam, currentGameState.teams);

        const otherTeamKey = teamKey === "north" ? "south" : "north";
        currentGameState.teams[otherTeamKey].score += POINT_VALUES.destroyingPiece;

        currentGameState.teams[teamKey].piecePool.total = currentGameState.teams[teamKey].piecePool.total.map(
            totalPoolPiece => {
                if (totalPoolPiece.type === piece.type) {
                    totalPoolPiece.total -= 1;
                }

                return totalPoolPiece;
            },
        );
    });
}

function maybeScorePiece(currentGameState: IStractGameV1, gameTile: IGameTile, rowIndex: number) {
    const teamRid = gameTile.occupiedBy[0].ownedByTeam;
    if (teamRid === undefined) {
        return;
    }

    const teamKey = getTeamKeyFromRid(teamRid, currentGameState.teams);
    const expectedScoreIndex = teamKey === "north" ? currentGameState.metadata.board.size.rows - 1 : 0;
    if (rowIndex !== expectedScoreIndex) {
        return;
    }

    gameTile.occupiedBy = [];
    currentGameState.teams[teamKey].score += POINT_VALUES.scoringPiece;
}

export function resolveGameBoard(currentGameState: IStractGameV1) {
    currentGameState.board.forEach((row, rowIndex) => {
        row.forEach(tile => {
            if (tile.occupiedBy === undefined || tile.occupiedBy.length === 0) {
                return;
            }

            if (tile.occupiedBy.length === 1) {
                maybeScorePiece(currentGameState, tile, rowIndex);
                return;
            }

            if (tile.occupiedBy.length > 2) {
                tile.occupiedBy = [];
                removePiecesFromAvailablePool(tile.occupiedBy, currentGameState);
                return;
            }

            const pieceOne = tile.occupiedBy[0];
            const pieceTwo = tile.occupiedBy[1];

            const { occupiedBy, losingPieces } = getWinningPiece(pieceOne, pieceTwo);
            tile.occupiedBy = occupiedBy;

            removePiecesFromAvailablePool(losingPieces, currentGameState);
        });
    });
}
