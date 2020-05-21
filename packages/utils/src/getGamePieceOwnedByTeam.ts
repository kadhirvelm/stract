import { IGameTile, IGamePieceId, ITeamRid, IOccupiedBy } from "@stract/api";

export function getAlivePieceOwnedByTeam(
    board: IGameTile[][],
    row: number,
    column: number,
    gamePieceId: IGamePieceId,
    ownedByTeam: ITeamRid,
) {
    const gamePiece = board[row][column].occupiedBy.find(ob => ob.piece.id === gamePieceId);
    if (gamePiece === undefined || !IOccupiedBy.isAlive(gamePiece) || gamePiece.piece.ownedByTeam !== ownedByTeam) {
        return undefined;
    }

    return gamePiece;
}
