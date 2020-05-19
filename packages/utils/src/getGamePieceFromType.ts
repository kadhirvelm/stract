import { IGamePieceType, IGamePiece, ITeamRid } from "@stract/api";

export function getGamePieceFromType(gamePieceType: IGamePieceType, ownedByTeam: ITeamRid) {
    switch (gamePieceType) {
        case "circle":
            return IGamePiece.circle({ isHidden: true, ownedByTeam });
        case "triangle":
            return IGamePiece.triangle({ isHidden: true, ownedByTeam });
        case "square":
            return IGamePiece.square({ isHidden: true, ownedByTeam });
        default:
            throw new Error(`Unexpected game piece type: ${gamePieceType}`);
    }
}
