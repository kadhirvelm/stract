/* eslint-disable no-param-reassign */
import { IStractGameV1, IGamePiece, IGameTile, IOccupiedBy, IOccupiedByAlive, IOccupiedByDestroyed } from "@stract/api";
import { getTeamKeyFromRid } from "@stract/utils";
import { POINT_VALUES } from "./pointValues";

function getWinningPiece(
    occupiedByOne: IOccupiedByAlive,
    occupiedByTwo: IOccupiedByAlive,
): { occupiedBy: IOccupiedBy[]; losingPieces: IOccupiedByDestroyed[] } {
    const pieceOne = occupiedByOne.piece;
    const pieceTwo = occupiedByTwo.piece;

    const pieceOneWinningScenario = {
        occupiedBy: [
            IOccupiedBy.alive({ piece: { ...pieceOne, isHidden: false } }),
            IOccupiedBy.destroyed({ piece: pieceTwo }),
        ],
        losingPieces: [IOccupiedBy.destroyed({ piece: pieceTwo })],
    };

    if (pieceOne.type === pieceTwo.type) {
        return {
            occupiedBy: [IOccupiedBy.destroyed({ piece: pieceOne }), IOccupiedBy.destroyed({ piece: pieceTwo })],
            losingPieces: [IOccupiedBy.destroyed({ piece: pieceOne }), IOccupiedBy.destroyed({ piece: pieceTwo })],
        };
    }

    if (IGamePiece.isFire(pieceOne) && IGamePiece.isEarth(pieceTwo)) {
        return pieceOneWinningScenario;
    }

    if (IGamePiece.isEarth(pieceOne) && IGamePiece.isWater(pieceTwo)) {
        return pieceOneWinningScenario;
    }

    if (IGamePiece.isWater(pieceOne) && IGamePiece.isFire(pieceTwo)) {
        return pieceOneWinningScenario;
    }

    return getWinningPiece(occupiedByTwo, occupiedByOne);
}

function removePiecesFromAvailablePool(losingPieces: IOccupiedByDestroyed[], currentGameState: IStractGameV1) {
    losingPieces.forEach(destroyedPiece => {
        const teamKey = getTeamKeyFromRid(destroyedPiece.piece.ownedByTeam, currentGameState.teams);

        const otherTeamKey = teamKey === "north" ? "south" : "north";
        currentGameState.teams[otherTeamKey].score += POINT_VALUES.destroyingPiece;

        currentGameState.teams[teamKey].piecePool.total = currentGameState.teams[teamKey].piecePool.total.map(
            totalPoolPiece => {
                if (totalPoolPiece.type === destroyedPiece.piece.type) {
                    totalPoolPiece.total -= 1;
                }

                return totalPoolPiece;
            },
        );
    });
}

function maybeScorePiece(currentGameState: IStractGameV1, gameTile: IGameTile, rowIndex: number) {
    const aliveOccupiedTiles = gameTile.occupiedBy.filter(IOccupiedBy.isAlive);
    if (aliveOccupiedTiles.length !== 1) {
        return;
    }

    const teamRid = aliveOccupiedTiles[0].piece.ownedByTeam;
    const teamKey = getTeamKeyFromRid(teamRid, currentGameState.teams);

    const expectedScoreIndex = teamKey === "north" ? currentGameState.metadata.board.size.rows - 1 : 0;
    if (rowIndex !== expectedScoreIndex) {
        return;
    }

    gameTile.occupiedBy = gameTile.occupiedBy
        .filter(ob => ob.piece.id !== aliveOccupiedTiles[0].piece.id)
        .concat([IOccupiedBy.scored({ piece: aliveOccupiedTiles[0].piece })]);
    currentGameState.teams[teamKey].score += POINT_VALUES.scoringPiece;
}

export function resolveGameBoard(currentGameState: IStractGameV1) {
    currentGameState.board.forEach((row, rowIndex) => {
        row.forEach(tile => {
            tile.occupiedBy = tile.occupiedBy.filter(IOccupiedBy.isAlive);

            if (tile.occupiedBy.length === 0) {
                return;
            }

            if (tile.occupiedBy.length === 1) {
                maybeScorePiece(currentGameState, tile, rowIndex);
                return;
            }

            if (tile.occupiedBy.length > 2) {
                tile.occupiedBy = tile.occupiedBy.map(ob => IOccupiedBy.destroyed({ piece: ob.piece }));
                removePiecesFromAvailablePool(tile.occupiedBy as IOccupiedByDestroyed[], currentGameState);
                return;
            }

            const pieceOne = tile.occupiedBy[0] as IOccupiedByAlive;
            const pieceTwo = tile.occupiedBy[1] as IOccupiedByAlive;

            const { occupiedBy, losingPieces } = getWinningPiece(pieceOne, pieceTwo);
            tile.occupiedBy = occupiedBy;

            removePiecesFromAvailablePool(losingPieces, currentGameState);
            maybeScorePiece(currentGameState, tile, rowIndex);
        });
    });
}
