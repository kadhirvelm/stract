import { IGamePieceType, IGamePiece, ITeamRid } from "@stract/api";

export function getGamePieceFromType(gamePieceType: IGamePieceType, ownedByTeam: ITeamRid) {
    switch (gamePieceType) {
        case "fire":
            return IGamePiece.fire({ isHidden: true, ownedByTeam });
        case "water":
            return IGamePiece.water({ isHidden: true, ownedByTeam });
        case "earth":
            return IGamePiece.earth({ isHidden: true, ownedByTeam });
        default:
            throw new Error(`Unexpected game piece type: ${gamePieceType}`);
    }
}
