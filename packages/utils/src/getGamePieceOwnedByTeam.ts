import { IGameTile, IGamePieceId, ITeamRid } from "@stract/api";

export function getPieceOwnedByTeam(
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
