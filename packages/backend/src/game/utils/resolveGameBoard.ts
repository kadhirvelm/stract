/* eslint-disable no-param-reassign */
import { IStractGameV1, IGamePiece } from "@stract/api";

function getWinningPiece(pieceOne: IGamePiece, pieceTwo: IGamePiece): IGamePiece[] {
    if (pieceOne.type === pieceTwo.type) {
        return [];
    }

    if (IGamePiece.isCircle(pieceOne) && IGamePiece.isSquare(pieceTwo)) {
        return [pieceOne];
    }

    if (IGamePiece.isSquare(pieceOne) && IGamePiece.isTriangle(pieceTwo)) {
        return [pieceOne];
    }

    if (IGamePiece.isTriangle(pieceOne) && IGamePiece.isCircle(pieceTwo)) {
        return [pieceOne];
    }

    return getWinningPiece(pieceTwo, pieceOne);
}

export function resolveGameBoard(currentGameState: IStractGameV1) {
    currentGameState.board.forEach(row => {
        row.forEach(tile => {
            if (tile.occupiedBy === undefined) {
                return;
            }

            if (tile.occupiedBy.length <= 1) {
                return;
            }

            if (tile.occupiedBy?.length > 2) {
                tile.occupiedBy = [];
                return;
            }

            const pieceOne = tile.occupiedBy[0];
            const pieceTwo = tile.occupiedBy[1];

            tile.occupiedBy = getWinningPiece(pieceOne, pieceTwo);
        });
    });
}
