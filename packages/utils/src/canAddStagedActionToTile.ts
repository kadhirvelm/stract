import { IAllTeams, IGameAction, IGameTile, IGameTileFree, IPlayer, IStractGameV1, ITeamRid } from "@stract/api";

export interface ICanAddStagedActionToTile {
    isValid: boolean;
    canSpawn?: boolean;
}

function canMoveTile(
    tile: IGameTileFree,
    rowIndex: number,
    columnIndex: number,
    playerTeamRid: ITeamRid,
    playerTeamStagedActions: IGameAction[],
) {
    const doAnyExistingStagedActionsMoveTheSamePiece = playerTeamStagedActions.find(a => {
        return (
            IGameAction.isMovePiece(a) && a.movePiece.startRow === rowIndex && a.movePiece.startColumn === columnIndex
        );
    });

    if (doAnyExistingStagedActionsMoveTheSamePiece !== undefined) {
        return { isValid: false };
    }

    return { isValid: tile.occupiedBy?.[0].ownedByTeam === playerTeamRid };
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
        return canMoveTile(tile, rowIndex, columnIndex, player.team, gameBoard.stagedActions[playerTeamKey]);
    }

    const canSpawn = playerTeamKey === "north" ? rowIndex === 0 : rowIndex === gameBoard.metadata.board.size.rows - 1;
    return { isValid: canSpawn, canSpawn };
}
