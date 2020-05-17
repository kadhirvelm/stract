import { IPlayer, IStractGameV1, IAllTeams, IGameTile } from "@stract/api";

export interface ICanAddStagedActionToTile {
    isValid: boolean;
    canSpawn?: boolean;
}

export function canAddAnyStagedActionToTile(
    player: IPlayer,
    gameBoard: IStractGameV1,
    rowIndex: number,
    columnIndex: number,
): ICanAddStagedActionToTile {
    const tile = gameBoard.board[rowIndex]?.[columnIndex];
    const playerTeamKey: keyof IAllTeams<any> = gameBoard.teams.north.id === player.team ? "north" : "south";

    if (tile === undefined) {
        return { isValid: false };
    }

    if (!IGameTile.isFree(tile)) {
        return { isValid: false };
    }

    if (tile?.occupiedBy !== undefined && tile?.occupiedBy.length > 0) {
        return { isValid: tile.occupiedBy[0].ownedByTeam === player.team };
    }

    const canSpawn = playerTeamKey === "north" ? rowIndex === 0 : rowIndex === gameBoard.metadata.board.size.rows - 1;

    return { isValid: canSpawn, canSpawn };
}
